import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import UserHeader from './UserHeader';

/**
 * User Layout Component
 * Wraps user pages with header and footer
 */
interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {isAuthenticated && <UserHeader />}
      <main className="flex-1">
        {children}
      </main>
      {/* Footer can be added here */}
    </div>
  );
}

