// frontend-company/src/pages/Company/Team.tsx
import React, { useState } from 'react';
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
    AlertTriangle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import Avatar from '../../components/ui/Avatar';

interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'member';
    status: 'active' | 'pending' | 'inactive';
    joinedAt: string;
    avatar?: string;
    lastActive?: string;
    department?: string;
}

const CompanyTeamPage: React.FC = () => {
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('member');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'member'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const teamMembers: TeamMember[] = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@company.com',
            role: 'admin',
            status: 'active',
            joinedAt: '2024-01-15',
            lastActive: '2024-03-20',
            department: 'Engineering'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@company.com',
            role: 'member',
            status: 'active',
            joinedAt: '2024-02-01',
            lastActive: '2024-03-19',
            department: 'Product'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike@company.com',
            role: 'member',
            status: 'pending',
            joinedAt: '2024-03-10',
            department: 'Engineering'
        },
        {
            id: 4,
            name: 'Sarah Wilson',
            email: 'sarah@company.com',
            role: 'member',
            status: 'inactive',
            joinedAt: '2024-01-20',
            lastActive: '2024-03-01',
            department: 'Marketing'
        },
    ];

    const handleInvite = () => {
        if (!inviteEmail) {
            toast.error('Please enter an email address');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(inviteEmail)) {
            toast.error('Please enter a valid email address');
            return;
        }
        toast.success(`Invitation sent to ${inviteEmail}`);
        setShowInviteModal(false);
        setInviteEmail('');
        setInviteRole('member');
    };

    const handleRemoveMember = (member: TeamMember) => {
        toast.info(`${member.name} removed from team`);
        setShowDeleteConfirm(false);
        setSelectedMember(null);
    };

    const handleResendInvite = (member: TeamMember) => {
        toast.success(`Invitation resent to ${member.email}`);
    };

    const handleChangeRole = (member: TeamMember, newRole: 'admin' | 'member') => {
        toast.success(`${member.name} is now ${newRole}`);
    };

    const handleViewMember = (member: TeamMember) => {
        setSelectedMember(member);
        setShowMemberModal(true);
    };

    const filteredMembers = teamMembers.filter(member => {
        const matchesSearch =
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || member.role === filterRole;
        const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const stats = {
        total: teamMembers.length,
        active: teamMembers.filter(m => m.status === 'active').length,
        pending: teamMembers.filter(m => m.status === 'pending').length,
        inactive: teamMembers.filter(m => m.status === 'inactive').length,
        admins: teamMembers.filter(m => m.role === 'admin').length,
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'success';
            case 'pending': return 'warning';
            case 'inactive': return 'gray';
            default: return 'gray';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return Check;
            case 'pending': return Clock;
            case 'inactive': return UserX;
            default: return UserX;
        }
    };

    const getRoleIcon = (role: string) => {
        return role === 'admin' ? Crown : UserCheck;
    };

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
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setShowInviteModal(true)}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                    <UserPlus className="h-4 w-4" />
                    Invite Team Member
                </Button>
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
                        {Math.round((stats.active / stats.total) * 100)}% of team
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
                            {filteredMembers.map((member) => {
                                const StatusIcon = getStatusIcon(member.status);
                                const RoleIcon = getRoleIcon(member.role);
                                const isPending = member.status === 'pending';

                                return (
                                    <tr key={member.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleViewMember(member)}>
                                                <Avatar
                                                    size="md"
                                                    className="flex-shrink-0"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <RoleIcon className={cn(
                                                    "h-4 w-4",
                                                    member.role === 'admin' ? "text-yellow-500" : "text-blue-500"
                                                )} />
                                                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{member.role}</span>
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
                                                {isPending && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleResendInvite(member)}
                                                        className="h-8 px-2 gap-1 text-xs"
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
                            })}
                        </tbody>
                    </table>
                </div>
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
                            <Avatar size="lg" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {selectedMember.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedMember.email}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant={getStatusColor(selectedMember.status) as any} size="sm" dot>
                                        {selectedMember.status}
                                    </Badge>
                                    <Badge variant="gray" size="sm">
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
                                <p className="text-gray-500 dark:text-gray-400">Joined</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {new Date(selectedMember.joinedAt).toLocaleDateString()}
                                </p>
                            </div>
                            {selectedMember.lastActive && (
                                <div className="col-span-2">
                                    <p className="text-gray-500 dark:text-gray-400">Last Active</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {new Date(selectedMember.lastActive).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                            {selectedMember.role === 'admin' ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        handleChangeRole(selectedMember, 'member');
                                        setShowMemberModal(false);
                                    }}
                                    className="gap-1.5"
                                >
                                    <UserMinus className="h-4 w-4" />
                                    Remove Admin
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        handleChangeRole(selectedMember, 'admin');
                                        setShowMemberModal(false);
                                    }}
                                    className="gap-1.5"
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
                                        setShowMemberModal(false);
                                    }}
                                    className="gap-1.5"
                                >
                                    <Send className="h-4 w-4" />
                                    Resend Invite
                                </Button>
                            )}
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                    setShowDeleteConfirm(true);
                                    setShowMemberModal(false);
                                }}
                                className="gap-1.5 ml-auto"
                            >
                                <Trash2 className="h-4 w-4" />
                                Remove
                            </Button>
                        </div>
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
                        Are you sure you want to remove {selectedMember?.name} from the team?
                        This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteConfirm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => selectedMember && handleRemoveMember(selectedMember)}
                            className="gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Remove Member
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
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="team@member.com"
                            className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Role
                        </label>
                        <select
                            value={inviteRole}
                            onChange={(e) => setInviteRole(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            variant="outline"
                            onClick={() => setShowInviteModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleInvite}
                            className="gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            <Send className="h-4 w-4" />
                            Send Invite
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CompanyTeamPage;