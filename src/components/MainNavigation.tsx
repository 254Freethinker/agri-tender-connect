import { useAuth } from '../hooks/useAuth';
import {
  MainNavigationProps,
} from '../types/partner';

const MainNavigation = ({ onNavigate }: MainNavigationProps) => {
  const { } = useAuth();

  return (
    <nav className="p-4">
      <div className="text-lg font-semibold">Navigation</div>
      <button onClick={() => onNavigate('dashboard')} className="block mt-2">
        Dashboard
      </button>
    </nav>
  );
};

export default MainNavigation;