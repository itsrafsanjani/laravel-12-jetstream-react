import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Badge } from '@/Components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import InputError from '@/Components/ui/InputError';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import HeadingSmall from '@/Components/HeadingSmall';
import {
    JetstreamTeamPermissions,
    Nullable,
    Role,
    Team,
    TeamInvitation,
    User,
} from '@/types';
import { router, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Settings, Trash2, UserMinus } from 'lucide-react';
import { Transition } from '@headlessui/react';

interface UserMembership extends User {
    membership: {
        role: string;
    };
}

interface Props {
    team: Team & {
        team_invitations: TeamInvitation[];
        users: UserMembership[];
    };
    availableRoles: Role[];
    userPermissions: JetstreamTeamPermissions;
}

export default function TeamMemberManager({
    team,
    availableRoles,
    userPermissions,
}: Props) {
    const route = useRoute();
    const addTeamMemberForm = useForm({
        email: '',
        role: null as Nullable<string>,
    });
    const updateRoleForm = useForm({
        role: null as Nullable<string>,
    });
    const leaveTeamForm = useForm({});
    const removeTeamMemberForm = useForm({});
    const [currentlyManagingRole, setCurrentlyManagingRole] = useState(false);
    const [managingRoleFor, setManagingRoleFor] = useState<Nullable<User>>(null);
    const [confirmingLeavingTeam, setConfirmingLeavingTeam] = useState(false);
    const [teamMemberBeingRemoved, setTeamMemberBeingRemoved] =
        useState<Nullable<User>>(null);
    const page = useTypedPage();

    function addTeamMember() {
        addTeamMemberForm.post(route('team-members.store', [team]), {
            errorBag: 'addTeamMember',
            preserveScroll: true,
            onSuccess: () => addTeamMemberForm.reset(),
        });
    }

    function cancelTeamInvitation(invitation: TeamInvitation) {
        router.delete(route('team-invitations.destroy', [invitation]), {
            preserveScroll: true,
        });
    }

    function manageRole(teamMember: UserMembership) {
        setManagingRoleFor(teamMember);
        updateRoleForm.setData('role', teamMember.membership.role);
        setCurrentlyManagingRole(true);
    }

    function updateRole() {
        if (!managingRoleFor) {
            return;
        }
        updateRoleForm.put(route('team-members.update', [team, managingRoleFor]), {
            preserveScroll: true,
            onSuccess: () => setCurrentlyManagingRole(false),
        });
    }

    function confirmLeavingTeam() {
        setConfirmingLeavingTeam(true);
    }

    function leaveTeam() {
        leaveTeamForm.delete(
            route('team-members.destroy', [team, page.props.auth.user!]),
        );
    }

    function confirmTeamMemberRemoval(teamMember: User) {
        setTeamMemberBeingRemoved(teamMember);
    }

    function removeTeamMember() {
        if (!teamMemberBeingRemoved) {
            return;
        }
        removeTeamMemberForm.delete(
            route('team-members.destroy', [team, teamMemberBeingRemoved]),
            {
                errorBag: 'removeTeamMember',
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setTeamMemberBeingRemoved(null),
            },
        );
    }

    function displayableRole(role: string) {
        return availableRoles.find(r => r.key === role)?.name;
    }

    function getRoleVariant(role: string): "default" | "secondary" | "destructive" | "outline" {
        switch (role) {
            case 'admin':
                return 'destructive';
            case 'editor':
                return 'default';
            default:
                return 'secondary';
        }
    }

    return (
        <div className="space-y-12">
            {/* Add Team Member Section */}
            {userPermissions.canAddTeamMembers && (
                <div className="space-y-6">
                    <HeadingSmall title="Add team member" description="Invite a new team member to collaborate with you" />

                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            addTeamMember();
                        }}
                        className="space-y-6"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                placeholder="Enter email address"
                                value={addTeamMemberForm.data.email}
                                onChange={e =>
                                    addTeamMemberForm.setData(
                                        'email',
                                        e.currentTarget.value,
                                    )
                                }
                            />
                            <InputError className="mt-2" message={addTeamMemberForm.errors.email} />
                        </div>

                        {availableRoles.length > 0 && (
                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={addTeamMemberForm.data.role || ''}
                                    onValueChange={value =>
                                        addTeamMemberForm.setData('role', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role">
                                            {addTeamMemberForm.data.role && (
                                                <span className="font-medium">
                                                    {availableRoles.find(r => r.key === addTeamMemberForm.data.role)?.name}
                                                </span>
                                            )}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableRoles.map(role => (
                                            <SelectItem key={role.key} value={role.key}>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{role.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {role.description}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError className="mt-2" message={addTeamMemberForm.errors.role} />
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button
                                type="submit"
                                disabled={addTeamMemberForm.processing}
                                className={cn({
                                    'opacity-50': addTeamMemberForm.processing,
                                })}
                            >
                                Send Invitation
                            </Button>

                            <Transition
                                show={addTeamMemberForm.recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Invitation sent</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            )}

            {/* Pending Invitations Section */}
            {team.team_invitations.length > 0 && userPermissions.canAddTeamMembers && (
                <div className="space-y-6">
                    <HeadingSmall title="Pending invitations" description="These people have been invited to join your team" />

                    <div className="space-y-4">
                        {team.team_invitations.map(invitation => (
                            <div
                                key={invitation.id}
                                className="flex items-center justify-between py-3 border-b"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>
                                            {invitation.email.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{invitation.email}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Invitation pending
                                        </p>
                                    </div>
                                </div>
                                {userPermissions.canRemoveTeamMembers && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => cancelTeamInvitation(invitation)}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Team Members Section */}
            {team.users.length > 0 && (
                <div className="space-y-6">
                    <HeadingSmall title="Team members" description="All current members of this team" />

                    <div className="space-y-4">
                        {team.users.map(user => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between py-3 border-b"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage
                                            src={user.profile_photo_url}
                                            alt={user.name}
                                        />
                                        <AvatarFallback>
                                            {user.name?.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {displayableRole(user.membership.role) && (
                                        <Badge variant={getRoleVariant(user.membership.role)}>
                                            {displayableRole(user.membership.role)}
                                        </Badge>
                                    )}

                                    {userPermissions.canAddTeamMembers && availableRoles.length > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => manageRole(user)}
                                        >
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                    )}

                                    {page.props.auth.user?.id === user.id ? (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={confirmLeavingTeam}
                                        >
                                            <UserMinus className="h-4 w-4" />
                                        </Button>
                                    ) : userPermissions.canRemoveTeamMembers ? (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => confirmTeamMemberRemoval(user)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Leave Team Section */}
            {page.props.auth.user && (
                <div className="space-y-6">
                    <HeadingSmall title="Leave team" description="If you leave this team, you will lose access to all team resources" />

                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <p className="text-sm text-red-800 mb-4">
                            Please proceed with caution, this cannot be undone.
                        </p>
                        <Button variant="destructive" onClick={confirmLeavingTeam}>
                            Leave Team
                        </Button>
                    </div>
                </div>
            )}

            {/* Role Management Dialog */}
            <Dialog
                open={currentlyManagingRole}
                onOpenChange={setCurrentlyManagingRole}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Role</DialogTitle>
                        <DialogDescription>
                            Select the new role for {managingRoleFor?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Select
                            value={updateRoleForm.data.role || ''}
                            onValueChange={value => updateRoleForm.setData('role', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role">
                                    {updateRoleForm.data.role && (
                                        <span className="font-medium">
                                            {availableRoles.find(r => r.key === updateRoleForm.data.role)?.name}
                                        </span>
                                    )}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {availableRoles.map(role => (
                                    <SelectItem key={role.key} value={role.key}>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{role.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {role.description}
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentlyManagingRole(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={updateRole}
                            disabled={updateRoleForm.processing}
                        >
                            Update Role
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Leave Team Confirmation Dialog */}
            <Dialog
                open={confirmingLeavingTeam}
                onOpenChange={setConfirmingLeavingTeam}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Leave Team</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to leave this team? You will lose access to all team resources.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setConfirmingLeavingTeam(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={leaveTeam}
                            disabled={leaveTeamForm.processing}
                        >
                            Leave Team
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Remove Team Member Confirmation Dialog */}
            <Dialog
                open={!!teamMemberBeingRemoved}
                onOpenChange={open => !open && setTeamMemberBeingRemoved(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove Team Member</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove {teamMemberBeingRemoved?.name} from this team?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setTeamMemberBeingRemoved(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={removeTeamMember}
                            disabled={removeTeamMemberForm.processing}
                        >
                            Remove Member
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
