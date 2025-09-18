import { createClient } from '@supabase/supabase-js';
import * as idbKeyval from 'idb-keyval';
import { v4 as uuidv4 } from 'uuid';
import { FarmStatistics, YieldTracking, ResourceUsage, FarmBudget, RevenueTracking, FarmAnalytics } from '@/types/farm-statistics';

interface PendingOperation {
  id: string;
  operation: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

export class OfflineSyncService {
  private supabase;
  private syncInProgress: boolean = false;
  private lastSyncTimestamp: number = 0;
  private readonly STORE_NAME = 'farm_statistics_offline';

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    this.initializeDB();
  }

  private async initializeDB() {
    // idb-keyval doesn't require explicit initialization
    await this.loadLastSyncTimestamp();
  }

  private async loadLastSyncTimestamp() {
    this.lastSyncTimestamp = await idbKeyval.get('lastSyncTimestamp') || 0;
  }

  private async saveLastSyncTimestamp() {
    await idbKeyval.set('lastSyncTimestamp', this.lastSyncTimestamp);
  }

  public async queueOperation(operation: 'create' | 'update' | 'delete', table: string, data: any) {
    const pendingOp: PendingOperation = {
      id: uuidv4(),
      operation,
      table,
      data,
      timestamp: Date.now(),
      retryCount: 0,
    };

    const pendingOps = await this.getPendingOperations();
    await idbKeyval.set('pending_operations', [...pendingOps, pendingOp]);
    this.attemptSync();
  }

  private async getPendingOperations(): Promise<PendingOperation[]> {
    return await idbKeyval.get('pending_operations') || [];
  }

  private async savePendingOperations(ops: PendingOperation[]) {
    await idbKeyval.set('pending_operations', ops);
  }

  private async attemptSync() {
    if (this.syncInProgress || !navigator.onLine) {
      return;
    }

    this.syncInProgress = true;

    try {
      const pendingOps = await this.getPendingOperations();
      const remainingOps: PendingOperation[] = [];

      for (const op of pendingOps) {
        try {
          await this.processPendingOperation(op);
        } catch (error: any) {
          console.error(`Sync error for operation ${op.id}:`, error);
          
          op.retryCount += 1;
          op.timestamp = Date.now() + (op.retryCount * 5 * 60 * 1000); // Exponential backoff
          
          if (op.retryCount < 5) {
            remainingOps.push(op);
          } else {
            // Mark as failed after 5 retries
            await this.queueOperation('create', 'sync_failures', {
              operation_id: op.id,
              error: error.message,
              timestamp: new Date().toISOString()
            });
          }
        }
      }

      await this.savePendingOperations(remainingOps);
      await this.pullServerChanges();
      
      this.lastSyncTimestamp = Date.now();
      await this.saveLastSyncTimestamp();
    } finally {
      this.syncInProgress = false;
    }
  }

  private async processPendingOperation(op: PendingOperation) {
    const { operation, table, data } = op;

    switch (operation) {
      case 'create':
        await this.supabase.from(table).insert(data);
        break;

      case 'update':
        await this.supabase
          .from(table)
          .update(data)
          .eq('id', data.id);
        break;

      case 'delete':
        await this.supabase
          .from(table)
          .delete()
          .eq('id', data.id);
        break;

      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  private async pullServerChanges() {
    const tables = [
      'farm_statistics',
      'yield_tracking',
      'resource_usage',
      'farm_budget',
      'revenue_tracking',
      'farm_analytics'
    ];

    for (const table of tables) {
      const { data, error } = await this.supabase
        .from(table)
        .select('*')
        .gt('updated_at', new Date(this.lastSyncTimestamp).toISOString());

      if (error) {
        console.error(`Error pulling changes for ${table}:`, error);
        continue;
      }

      if (data && data.length > 0) {
        await idbKeyval.set(`${this.STORE_NAME}_${table}`, data);
      }
    }
  }

  public async getOfflineData<T>(table: string): Promise<T[]> {
    return await idbKeyval.get(`${this.STORE_NAME}_${table}`) || [];
  }

  public isOnline(): boolean {
    return navigator.onLine;
  }

  public getLastSyncTime(): Date {
    return new Date(this.lastSyncTimestamp);
  }

  // Event listeners
  public initializeEventListeners() {
    window.addEventListener('online', () => this.attemptSync());
    
    window.addEventListener('offline', () => {
      console.log('Device is offline, operations will be queued');
    });
  }

  // Clear all offline data
  public async clearOfflineData() {
    const tables = [
      'pending_operations',
      'farm_statistics',
      'yield_tracking',
      'resource_usage',
      'farm_budget',
      'revenue_tracking',
      'farm_analytics'
    ];

    for (const table of tables) {
      await idbKeyval.del(`${this.STORE_NAME}_${table}`);
    }

    await idbKeyval.del('lastSyncTimestamp');
  }
}
