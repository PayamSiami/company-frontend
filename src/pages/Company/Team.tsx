// frontend-company/src/pages/Company/Team.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import {
    fetchTeamMembers,
    inviteTeamMember,
    removeTeamMember,
    updateMemberRole,
    resendInvite,
} from '../../store/slices/team.slice';
import { Card } from '../../components/common/UI/Card';
import { Button } from '../../components/common/UI/Button';
import { Input } from '../../components/common/UI/Input';
import { Badge } from '../../components/common/UI/Badge';
import { Modal } from '../../components/common/UI/Modal';
import {
    Users,
    UserPlus,
    Crown,
    MoreVertical,
    Check,
    UserX,
    Clock,
    UserCheck,
    UserMinus,
    Send,
    Trash2,
    Activity,
    Search,
    AlertTriangle,
    Loader2,
    RefreshCw,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import Avatar from '../../components/ui/Avatar';
import { useAppDispatch } from '../../store/hooks';

interface TeamMember {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'admin' | 'member' | 'owner';
    status: 'active' | 'pending' | 'inactive' | 'suspended';
    joinedAt: string;
    avatar?: string;
    lastActive?: string;
    department?: string;
    phone?: string;
    position?: string;
}

interface InviteData {
    email: string;
    role: 'admin' | 'member';
    department?: string;
    message?: string;
}

const CompanyTeamPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { members, isLoading, error, pagination, lastUpdated } = useSelector(
        (state: RootState) => state.team
    );
    const user: any = useSelector((state: RootState) => state.auth);

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteData, setInviteData] = useState<InviteData>({
        email: '',
        role: 'member',
        department: '',
        message: '',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'member' | 'owner'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'inactive' | 'suspended'>('all');
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showRoleChangeConfirm, setShowRoleChangeConfirm] = useState(false);
    const [newRole, setNewRole] = useState<'admin' | 'member'>('member');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Fetch team members on mount
    useEffect(() => {
        dispatch(fetchTeamMembers({ page: currentPage, limit: itemsPerPage }));
    }, [dispatch, currentPage, itemsPerPage]);

    // Handle refresh
    const handleRefresh = () => {
        dispatch(fetchTeamMembers({ page: currentPage, limit: itemsPerPage }));
        toast.info('Refreshing team data...');
    };

    // Filter and sort members
    const filteredMembers = useMemo(() => {
        let filtered = members;

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (member) =>
                    member.firstName.toLowerCase().includes(term) ||
                    member.lastName.toLowerCase().includes(term) ||
                    member.email.toLowerCase().includes(term) ||
                    member.department?.toLowerCase().includes(term)
            );
        }

        // Role filter
        if (filterRole !== 'all') {
            filtered = filtered.filter((member) => member.role === filterRole);
        }

        // Status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter((member) => member.status === filterStatus);
        }

        return filtered;
    }, [members, searchTerm, filterRole, filterStatus]);

    // Stats
    const stats = useMemo(() => {
        const total = members.length;
        const active = members.filter((m) => m.status === 'active').length;
        const pending = members.filter((m) => m.status === 'pending').length;
        const inactive = members.filter((m) => m.status === 'inactive' || m.status === 'suspended').length;
        const admins = members.filter((m) => m.role === 'admin' || m.role === 'owner').length;

        return { total, active, pending, inactive, admins };
    }, [members]);

    // Handle invite submission
    const handleInvite = async () => {
        if (!inviteData.email) {
            toast.error('Please enter an email address');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(inviteData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(inviteTeamMember(inviteData)).unwrap();
            toast.success(`Invitation sent to ${inviteData.email}`);
            setShowInviteModal(false);
            setInviteData({ email: '', role: 'member', department: '', message: '' });
        } catch (error: any) {
            toast.error(error || 'Failed to send invitation');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle remove member
    const handleRemoveMember = async (member: TeamMember) => {
        setIsSubmitting(true);
        try {
            await dispatch(removeTeamMember(member.id)).unwrap();
            toast.success(`${member.firstName} ${member.lastName} removed from team`);
            setShowDeleteConfirm(false);
            setSelectedMember(null);
        } catch (error: any) {
            toast.error(error || 'Failed to remove member');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle resend invite
    const handleResendInvite = async (member: TeamMember) => {
        setIsSubmitting(true);
        try {
            await dispatch(resendInvite(member.id)).unwrap();
            toast.success(`Invitation resent to ${member.email}`);
        } catch (error: any) {
            toast.error(error || 'Failed to resend invitation');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle role change
    const handleChangeRole = async (member: TeamMember, role: 'admin' | 'member') => {
        setIsSubmitting(true);
        try {
            await dispatch(updateMemberRole({ userId: member.id, role })).unwrap();
            toast.success(`${member.firstName} ${member.lastName} is now ${role}`);
            setShowRoleChangeConfirm(false);
            setSelectedMember(null);
        } catch (error: any) {
            toast.error(error || 'Failed to update role');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle view member
    const handleViewMember = (member: TeamMember) => {
        setSelectedMember(member);
        setShowMemberModal(true);
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'pending':
                return 'warning';
            case 'inactive':
                return 'gray';
            case 'suspended':
                return 'danger';
            default:
                return 'gray';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return Check;
            case 'pending':
                return Clock;
            case 'inactive':
                return UserX;
            case 'suspended':
                return AlertTriangle;
            default:
                return UserX;
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'owner':
                return Crown;
            case 'admin':
                return Crown;
            default:
                return UserCheck;
        }
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'owner':
                return 'primary';
            case 'admin':
                return 'info';
            default:
                return 'gray';
        }
    };

    // Check if current user can perform actions
    const canManageTeam = user?.role === 'admin' || user?.role === 'owner';

    if (isLoading && members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-500" />
                    </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Loading team members...</p>
            </div>
        );
    }

    if (error && members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Failed to load team</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md text-center">{error}</p>
                <Button onClick={handleRefresh} variant="outline" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                Team Management
                                <Badge variant="info" size="sm" className="ml-2">
                                    <Activity className="w-3 h-3 mr-1" />
                                    {stats.total} members
                                </Badge>
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                                Manage your team members and their roles
                                {lastUpdated && (
                                    <span className="ml-2 text-xs">
                                        Updated: {new Date(lastUpdated).toLocaleString()}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="gap-1.5"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <RefreshCw className="w-4 h-4" />
                        )}
                        Refresh
                    </Button>
                    {canManageTeam && (
                        <Button
                            variant="primary"
                            onClick={() => setShowInviteModal(true)}
                            className="gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            <UserPlus className="h-4 w-4" />
                            Invite Team Member
                        </Button>
                    )}
                </div>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Card className="p-4 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Members</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">team size</p>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                        {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of team
                    </p>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pending Invites</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">waiting to join</p>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Admins</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.admins}</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">team managers</p>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Inactive</p>
                    <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.inactive}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">not active</p>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search members..."
                            className="pl-9 w-48 md:w-64 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                        />
                    </div>

                    {/* Role Filter */}
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value as any)}
                        className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Roles</option>
                        <option value="owner">Owner</option>
                        <option value="admin">Admins</option>
                        <option value="member">Members</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>

                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
                </span>
            </div>

            {/* Team List */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Member
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Department
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                            {isLoading && members.length > 0 ? (
                                // Skeleton loading rows
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={`skeleton-${index}`} className="animate-pulse">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                                                <div>
                                                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                                                    <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded mt-1" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded ml-auto" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredMembers.length > 0 ? (
                                filteredMembers.map((member) => {
                                    const StatusIcon = getStatusIcon(member.status);
                                    const RoleIcon = getRoleIcon(member.role);
                                    const isPending = member.status === 'pending';
                                    const isCurrentUser = user?.id === member.id;

                                    return (
                                        <tr
                                            key={member.id}
                                            className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div
                                                    className="flex items-center gap-3 cursor-pointer"
                                                    onClick={() => handleViewMember(member)}
                                                >
                                                    <Avatar
                                                        // name={`${member.firstName} ${member.lastName}`}
                                                        size="md"
                                                        className="flex-shrink-0"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {member.firstName} {member.lastName}
                                                            {isCurrentUser && (
                                                                <Badge variant="gray" size="sm" className="ml-2">
                                                                    You
                                                                </Badge>
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <RoleIcon
                                                        className={cn(
                                                            'h-4 w-4',
                                                            member.role === 'owner'
                                                                ? 'text-amber-500'
                                                                : member.role === 'admin'
                                                                    ? 'text-blue-500'
                                                                    : 'text-gray-500'
                                                        )}
                                                    />
                                                    <Badge variant={getRoleBadgeVariant(member.role)} size="sm">
                                                        {member.role}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {member.department || '—'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge
                                                    variant={getStatusColor(member.status) as any}
                                                    size="sm"
                                                    dot={member.status === 'active'}
                                                    className="flex items-center gap-1.5"
                                                >
                                                    <StatusIcon className="w-3 h-3" />
                                                    {member.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(member.joinedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {isPending && canManageTeam && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleResendInvite(member)}
                                                            className="h-8 px-2 gap-1 text-xs"
                                                            disabled={isSubmitting}
                                                        >
                                                            <Send className="h-3.5 w-3.5" />
                                                            Resend
                                                        </Button>
                                                    )}
                                                    <button
                                                        onClick={() => handleViewMember(member)}
                                                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                            <p className="text-gray-500 dark:text-gray-400">No members found</p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                                {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                                                    ? 'Try adjusting your filters'
                                                    : 'Invite your first team member to get started'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                            {pagination.total} members
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1 || isLoading}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                                disabled={currentPage === pagination.totalPages || isLoading}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Member Detail Modal */}
            <Modal
                isOpen={showMemberModal}
                onClose={() => setShowMemberModal(false)}
                title="Member Details"
                size="md"
            >
                {selectedMember && (
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            {/* <Avatar
                name={`${selectedMember.firstName} ${selectedMember.lastName}`}
                size="lg"
              /> */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {selectedMember.firstName} {selectedMember.lastName}
                                    {/* {selectedMember.id === user?.id && (
                    <Badge variant="gray" size="sm" className="ml-2">
                      You
                    </Badge>
                  )} */}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedMember.email}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant={getStatusColor(selectedMember.status) as any} size="sm" dot>
                                        {selectedMember.status}
                                    </Badge>
                                    <Badge variant={getRoleBadgeVariant(selectedMember.role)} size="sm">
                                        {selectedMember.role}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Department</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {selectedMember.department || '—'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Position</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {selectedMember.position || '—'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Joined</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {new Date(selectedMember.joinedAt).toLocaleDateString()}
                                </p>
                            </div>
                            {selectedMember.phone && (
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400">Phone</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{selectedMember.phone}</p>
                                </div>
                            )}
                            {selectedMember.lastActive && (
                                <div className="col-span-2">
                                    <p className="text-gray-500 dark:text-gray-400">Last Active</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {new Date(selectedMember.lastActive).toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        {canManageTeam && !selectedMember.id === user?.id && (
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                                {selectedMember.role === 'owner' ? (
                                    <Badge variant="gray" size="sm" className="text-xs">
                                        Cannot change owner role
                                    </Badge>
                                ) : selectedMember.role === 'admin' ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setNewRole('member');
                                            setShowRoleChangeConfirm(true);
                                            setShowMemberModal(false);
                                        }}
                                        className="gap-1.5"
                                        disabled={isSubmitting}
                                    >
                                        <UserMinus className="h-4 w-4" />
                                        Remove Admin
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setNewRole('admin');
                                            setShowRoleChangeConfirm(true);
                                            setShowMemberModal(false);
                                        }}
                                        className="gap-1.5"
                                        disabled={isSubmitting}
                                    >
                                        <Crown className="h-4 w-4" />
                                        Make Admin
                                    </Button>
                                )}
                                {selectedMember.status === 'pending' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            handleResendInvite(selectedMember);
                                        }}
                                        className="gap-1.5"
                                        disabled={isSubmitting}
                                    >
                                        <Send className="h-4 w-4" />
                                        Resend Invite
                                    </Button>
                                )}
                                {/* {selectedMember.status !== 'suspended' && selectedMember.id !== user?.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      dispatch(updateMemberStatus({ 
                        userId: selectedMember.id, 
                        status: 'suspended' 
                      })).unwrap()
                        .then(() => {
                          toast.success(`${selectedMember.firstName} suspended`);
                          setShowMemberModal(false);
                        })
                        .catch((err) => toast.error(err));
                    }}
                    className="gap-1.5"
                    disabled={isSubmitting}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Suspend
                  </Button>
                )} */}
                                {selectedMember.id !== user?.id && (
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => {
                                            setShowDeleteConfirm(true);
                                            setShowMemberModal(false);
                                        }}
                                        className="gap-1.5 ml-auto"
                                        disabled={isSubmitting}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Remove
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Remove Team Member"
                size="sm"
            >
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 text-red-600">
                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-semibold">Remove Member</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Are you sure you want to remove {selectedMember?.firstName} {selectedMember?.lastName} from the team?
                        This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => selectedMember && handleRemoveMember(selectedMember)}
                            className="gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                            Remove Member
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Role Change Confirmation Modal */}
            <Modal
                isOpen={showRoleChangeConfirm}
                onClose={() => setShowRoleChangeConfirm(false)}
                title="Change Role"
                size="sm"
            >
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            {newRole === 'admin' ? (
                                <Crown className="h-5 w-5 text-blue-600" />
                            ) : (
                                <UserMinus className="h-5 w-5 text-blue-600" />
                            )}
                        </div>
                        <h3 className="text-lg font-semibold">
                            {newRole === 'admin' ? 'Make Admin' : 'Remove Admin'}
                        </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        {newRole === 'admin'
                            ? `Are you sure you want to make ${selectedMember?.firstName} ${selectedMember?.lastName} an admin? They will have full access to team management.`
                            : `Are you sure you want to remove admin privileges from ${selectedMember?.firstName} ${selectedMember?.lastName}?`}
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            variant="outline"
                            onClick={() => setShowRoleChangeConfirm(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => selectedMember && handleChangeRole(selectedMember, newRole)}
                            className="gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Check className="h-4 w-4" />
                            )}
                            Confirm
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Invite Modal */}
            <Modal
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                title="Invite Team Member"
                size="sm"
            >
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Email Address *
                        </label>
                        <Input
                            type="email"
                            value={inviteData.email}
                            onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                            placeholder="team@member.com"
                            className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Role
                        </label>
                        <select
                            value={inviteData.role}
                            onChange={(e) => setInviteData({ ...inviteData, role: e.target.value as 'admin' | 'member' })}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            disabled={isSubmitting}
                        >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Department (Optional)
                        </label>
                        <Input
                            type="text"
                            value={inviteData.department}
                            onChange={(e) => setInviteData({ ...inviteData, department: e.target.value })}
                            placeholder="e.g., Engineering, Product, Marketing"
                            className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Personal Message (Optional)
                        </label>
                        <textarea
                            value={inviteData.message}
                            onChange={(e) => setInviteData({ ...inviteData, message: e.target.value })}
                            placeholder="Add a personal message to the invitation..."
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                            rows={3}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            variant="outline"
                            onClick={() => setShowInviteModal(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleInvite}
                            className="gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                            Send Invite
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CompanyTeamPage;