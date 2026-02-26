import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

/**
 * Admin Layout Component
 * Wraps admin pages with sidebar and main content area
 */
export default function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          {title && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600 mt-1">
                Manage your e-commerce platform
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

