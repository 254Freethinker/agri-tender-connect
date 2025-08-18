import { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';

export type ServiceResponse<T> = {
  data: T;
  error: PostgrestError | null;
};
