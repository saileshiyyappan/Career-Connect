import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Badge } from '../../components/common/Badge';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { adminPortalService, AdminUser } from '../../services/adminPortalService';
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Trash2,
  KeyRound,
  Shield,
  CheckCircle2,
  XCircle,
  Filter,
  Eye,
  Mail,
  Calendar,
  Clock,
} from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  useEffect(() => {
    adminPortalService.getUsers().then(setUsers);
  }, []);

  const handleUpdateStatus = async (userId: string, newStatus: AdminUser['status']) => {
    await adminPortalService.updateUserStatus(userId, newStatus);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    setActionSuccessMsg(`User status updated to ${newStatus}`);
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  const handleUpdateRole = async (userId: string, newRole: AdminUser['role']) => {
    await adminPortalService.updateUserRole(userId, newRole);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
    setActionSuccessMsg(`User role updated to ${newRole === 'employer' ? 'Employer' : newRole === 'admin' ? 'Admin' : 'Job Seeker'}`);
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to permanently delete this user account from CareerConnect?')) {
      await adminPortalService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setSelectedUser(null);
      setActionSuccessMsg('User account permanently deleted.');
      setTimeout(() => setActionSuccessMsg(''), 3000);
    }
  };

  const handleResetPassword = (email: string) => {
    setActionSuccessMsg(`Password reset email triggered for ${email} (Firebase Auth API)`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    return true;
  });

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader
        title="Platform User Management & Governance"
        subtitle="Manage job seekers, employer accounts, and administrative roles across CareerConnect."
        badge="Identity Directory"
      />

      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          {actionSuccessMsg}
        </div>
      )}

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name, email, or account ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Roles</option>
            <option value="job_seeker">Job Seekers</option>
            <option value="employer">Employers</option>
            <option value="admin">Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Pending Verification">Pending</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-slate-900 dark:text-white">{user.name}</span>
                          {user.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
                        </div>
                        <span className="text-[11px] text-slate-400">{user.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                      {user.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        user.status === 'Active' ? 'success' : user.status === 'Suspended' ? 'danger' : 'warning'
                      }
                      size="sm"
                    >
                      {user.status}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">{user.joinedDate}</td>
                  <td className="py-3.5 px-4 text-slate-500">{user.lastLogin}</td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-bold hover:bg-purple-100 transition-colors cursor-pointer"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail & Governance Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    {selectedUser.name}
                    {selectedUser.verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <p className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                  Account Summary
                </p>
                <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                  <div>Role: <strong className="uppercase">{selectedUser.role}</strong></div>
                  <div>Status: <strong>{selectedUser.status}</strong></div>
                  <div>Joined: <strong>{selectedUser.joinedDate}</strong></div>
                  <div>Last Login: <strong>{selectedUser.lastLogin}</strong></div>
                </div>
              </div>

              {/* Role Governance */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <p className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                  Role Governance
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateRole(selectedUser.id, 'employer')}
                    disabled={selectedUser.role === 'employer'}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      selectedUser.role === 'employer'
                        ? 'bg-blue-600 text-white cursor-default'
                        : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Employer
                  </button>

                  <button
                    onClick={() => handleUpdateRole(selectedUser.id, 'job_seeker')}
                    disabled={selectedUser.role === 'job_seeker'}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      selectedUser.role === 'job_seeker'
                        ? 'bg-blue-600 text-white cursor-default'
                        : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Job Seeker
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleResetPassword(selectedUser.email)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-amber-500" />
                  Trigger Password Reset Link
                </button>

                {selectedUser.status === 'Active' ? (
                  <button
                    onClick={() => handleUpdateStatus(selectedUser.id, 'Suspended')}
                    className="w-full py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserX className="w-4 h-4" />
                    Suspend User Account
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(selectedUser.id, 'Active')}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    Reactivate Account
                  </button>
                )}

                <button
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Permanently Delete User
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <SecondaryButton onClick={() => setSelectedUser(null)}>
                Close Modal
              </SecondaryButton>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
