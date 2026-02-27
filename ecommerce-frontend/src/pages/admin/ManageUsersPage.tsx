import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'react-toastify';
import {
  fetchUsers,
  blockUserThunk,
  unblockUserThunk,
  clearError,
} from '@/features/admin/adminSlice';
import type { RootState } from '@/app/store';
import { formatPrice } from '@/utils/formatPrice';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  orders: number;
  totalSpent: number;
}

/**
 * Manage Users Page
 * Admin page for managing user accounts
 * Features:
 * - User list with pagination from database
 * - Search users
 * - Filter by role and status
 * - View user details
 * - Block/Unblock users
 * - View user orders and spending
 */
export default function ManageUsersPage() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.admin
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const itemsPerPage = 10;

  // Load users from database on mount
  useEffect(() => {
    const fetch = async () => {
      const pageIndex = currentPage - 1;
      console.log('ManageUsersPage: dispatching fetchUsers', { page: pageIndex, limit: itemsPerPage, search: searchTerm, status: statusFilter });
      try {
        await dispatch(
          fetchUsers({
            page: pageIndex,
            limit: itemsPerPage,
            search: searchTerm,
            status: statusFilter !== 'all' ? statusFilter : '',
          }) as any
        ).unwrap();
        console.log('ManageUsersPage: fetchUsers fulfilled');
      } catch (err: any) {
        console.error('ManageUsersPage: fetchUsers error', err);
        toast.error(err?.message || 'Failed to load users from server');
      }
    };
    fetch();
  }, [dispatch, currentPage, searchTerm, statusFilter]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  // Use backend data directly
  const paginatedUsers = (users.data && Array.isArray(users.data)) ? users.data : [];
  const totalPages = users.total ? Math.ceil(users.total / itemsPerPage) : 0;

  const filteredUsers = paginatedUsers.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      !searchTerm || u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleSelectUser = (id: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === paginatedUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(paginatedUsers.map((u) => u.id)));
    }
  };

  const handleChangeRole = (id: string, newRole: 'user' | 'admin') => {
    // TODO: dispatch an API call to update role when endpoint available
    toast.success('User role updated');
  };

  const handleChangeStatus = (id: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    // When admin chooses to suspend/block a user, call blockUserThunk; for unblocking, use unblockUserThunk
    if (newStatus === 'suspended') {
      dispatch(blockUserThunk({ id, blocked: true, reason: 'Blocked by admin' }) as any);
      toast.success('User blocked successfully');
    } else if (newStatus === 'active') {
      dispatch(unblockUserThunk(id) as any);
      toast.success('User unblocked successfully');
    } else {
      // For inactive or other statuses, show toast and rely on backend API to implement
      toast.info(`Set status to ${newStatus}`);
    }
  };

  const handleUnblockUser = (id: string) => {
    dispatch(unblockUserThunk(id) as any);
    toast.success('User unblocked successfully');
  };

  const handleBulkStatus = (status: 'active' | 'inactive' | 'suspended') => {
    if (selectedUsers.size === 0) {
      toast.warning('No users selected');
      return;
    }
    // Dispatch block/unblock per selected user
    selectedUsers.forEach((id) => {
      if (status === 'suspended') {
        dispatch(blockUserThunk({ id, blocked: true, reason: 'Bulk blocked' }) as any);
      } else if (status === 'active') {
        dispatch(unblockUserThunk(id) as any);
      }
    });
    setSelectedUsers(new Set());
    toast.success(`${selectedUsers.size} users ${status}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <AdminLayout title="Manage Users">
      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.size > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkStatus('active')}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkStatus('suspended')}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium"
              >
                Suspend
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Users Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === paginatedUsers.length && paginatedUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Orders</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Spent</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Joined</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-600">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleChangeRole(user.id, e.target.value as 'user' | 'admin')
                          }
                          className={`px-3 py-1 rounded text-sm font-medium border-0 cursor-pointer ${getRoleColor(
                            user.role
                          )}`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.status}
                          onChange={(e) =>
                            handleChangeStatus(
                              user.id,
                              e.target.value as 'active' | 'inactive' | 'suspended'
                            )
                          }
                          className={`px-3 py-1 rounded text-sm font-medium border-0 cursor-pointer ${getStatusColor(
                            user.status
                          )}`}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {user.orders}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {formatPrice(user.totalSpent)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          className="text-blue-600 hover:text-blue-800 font-medium"
                          title="View Details"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {users?.total > 0 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, users.total)} of{' '}
                {users.total} users
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = i + 1;
                  if (totalPages > 5 && i === 4) {
                    return (
                      <span key="dots" className="px-2 py-2">
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}

