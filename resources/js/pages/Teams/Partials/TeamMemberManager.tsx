import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import ActionMessage from '@/Components/ActionMessage';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
} from '@/Components/ui/card';
import InputError from '@/Components/ui/InputError';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Separator } from '@/Components/ui/separator';
import {
    JetstreamTeamPermissions,
    Nullable,
    Role,
    Team,
    TeamInvitation,
    User,
} from '@/types';
import { router, useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useState } from 'react';

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

    return (
        <div>
            {userPermissions.canAddTeamMembers ? (
                <div>
                    <div className="hidden sm:block">
                        <div className="py-8">
                            <Separator />
                        </div>
                    </div>

                    <div className="md:grid md:grid-cols-3 md:gap-6">
                        <div className="md:col-span-1">
                            <div className="px-4 sm:px-0">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Add Team Member
                                </h3>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Add a new team member to your team, allowing them to
                                    collaborate with you.
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 md:mt-0 md:col-span-2">
                            <form
                                onSubmit={e => {
                                    e.preventDefault();
                                    addTeamMember();
                                }}
                            >
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-6 gap-6">
                                            <div className="col-span-6">
                                                <div className="max-w-xl text-sm text-gray-600 dark:text-gray-400">
                                                    Please provide the email address of the person you
                                                    would like to add to this team.
                                                </div>
                                            </div>

                                            {/* <!-- Member Email --> */}
                                            <div className="col-span-6 sm:col-span-4">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    className="mt-1 block w-full"
                                                    value={addTeamMemberForm.data.email}
                                                    onChange={e =>
                                                        addTeamMemberForm.setData(
                                                            'email',
                                                            e.currentTarget.value,
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={addTeamMemberForm.errors.email}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* <!-- Role --> */}
                                            {availableRoles.length > 0 ? (
                                                <div className="col-span-6 lg:col-span-4">
                                                    <Label htmlFor="roles">Role</Label>
                                                    <InputError
                                                        message={addTeamMemberForm.errors.role}
                                                        className="mt-2"
                                                    />

                                                    <div className="relative z-0 mt-1 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer">
                                                        {availableRoles.map((role, i) => (
                                                            <button
                                                                type="button"
                                                                className={classNames(
                                                                    'relative px-4 py-3 inline-flex w-full rounded-lg focus:z-10 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600',
                                                                    {
                                                                        'border-t border-gray-200 dark:border-gray-700 focus:border-none rounded-t-none':
                                                                            i > 0,
                                                                        'rounded-b-none':
                                                                            i !=
                                                                            Object.keys(availableRoles).length - 1,
                                                                    },
                                                                )}
                                                                onClick={() =>
                                                                    addTeamMemberForm.setData('role', role.key)
                                                                }
                                                                key={role.key}
                                                            >
                                                                <div
                                                                    className={classNames({
                                                                        'opacity-50':
                                                                            addTeamMemberForm.data.role &&
                                                                            addTeamMemberForm.data.role != role.key,
                                                                    })}
                                                                >
                                                                    {/* <!-- Role Name --> */}
                                                                    <div className="flex items-center">
                                                                        <div
                                                                            className={classNames(
                                                                                'text-sm text-gray-600 dark:text-gray-400',
                                                                                {
                                                                                    'font-semibold':
                                                                                        addTeamMemberForm.data.role ==
                                                                                        role.key,
                                                                                },
                                                                            )}
                                                                        >
                                                                            {role.name}
                                                                        </div>

                                                                        {addTeamMemberForm.data.role ==
                                                                            role.key ? (
                                                                            <svg
                                                                                className="ml-2 h-5 w-5 text-green-400"
                                                                                fill="none"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth="2"
                                                                                stroke="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                                            </svg>
                                                                        ) : null}
                                                                    </div>

                                                                    {/* <!-- Role Description --> */}
                                                                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                                                        {role.description}
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </CardContent>

                                    <CardFooter>
                                        <div className="flex items-center justify-end text-right">
                                            <ActionMessage
                                                on={addTeamMemberForm.recentlySuccessful}
                                                className="mr-3"
                                            >
                                                Added.
                                            </ActionMessage>

                                            <Button
                                                className={classNames({
                                                    'opacity-25': addTeamMemberForm.processing,
                                                })}
                                                disabled={addTeamMemberForm.processing}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </form>
                        </div>
                    </div>
                </div>
            ) : null}

            {team.team_invitations.length > 0 && userPermissions.canAddTeamMembers ? (
                <div>
                    <div className="hidden sm:block">
                        <div className="py-8">
                            <Separator />
                        </div>
                    </div>

                    <div className="mt-10 sm:mt-0 md:grid md:grid-cols-3 md:gap-6">
                        <div className="md:col-span-1">
                            <div className="px-4 sm:px-0">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Pending Team Invitations
                                </h3>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    These people have been invited to your team and have been
                                    sent an invitation email. They may join the team by
                                    accepting the email invitation.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 md:mt-0 md:col-span-2">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        {team.team_invitations.map(invitation => (
                                            <div
                                                className="flex items-center justify-between"
                                                key={invitation.id}
                                            >
                                                <div className="text-gray-600 dark:text-gray-400">
                                                    {invitation.email}
                                                </div>

                                                <div className="flex items-center">
                                                    {userPermissions.canRemoveTeamMembers ? (
                                                        <Button
                                                            variant="link"
                                                            className="cursor-pointer ml-6 text-sm text-red-500 focus:outline-none"
                                                            onClick={() => cancelTeamInvitation(invitation)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    ) : null}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            ) : null}

            {team.users.length > 0 ? (
                <div>
                    <div className="hidden sm:block">
                        <div className="py-8">
                            <Separator />
                        </div>
                    </div>

                    <div className="mt-10 sm:mt-0 md:grid md:grid-cols-3 md:gap-6">
                        <div className="md:col-span-1">
                            <div className="px-4 sm:px-0">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Team Members
                                </h3>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    All of the people that are part of this team.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 md:mt-0 md:col-span-2">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        {team.users.map(user => (
                                            <div
                                                className="flex items-center justify-between"
                                                key={user.id}
                                            >
                                                <div className="flex items-center">
                                                    <img
                                                        className="w-8 h-8 rounded-full"
                                                        src={user.profile_photo_url}
                                                        alt={user.name}
                                                    />
                                                    <div className="ml-4 dark:text-white">
                                                        {user.name}
                                                    </div>
                                                </div>

                                                <div className="flex items-center">
                                                    {userPermissions.canAddTeamMembers &&
                                                        availableRoles.length ? (
                                                        <Button
                                                            variant="link"
                                                            className="ml-2 text-sm text-gray-400"
                                                            onClick={() => manageRole(user)}
                                                        >
                                                            {displayableRole(user.membership.role)}
                                                        </Button>
                                                    ) : availableRoles.length ? (
                                                        <div className="ml-2 text-sm text-gray-400">
                                                            {displayableRole(user.membership.role)}
                                                        </div>
                                                    ) : null}

                                                    {page.props.auth.user?.id === user.id ? (
                                                        <Button
                                                            variant="link"
                                                            className="cursor-pointer ml-6 text-sm text-red-500"
                                                            onClick={confirmLeavingTeam}
                                                        >
                                                            Leave
                                                        </Button>
                                                    ) : null}

                                                    {userPermissions.canRemoveTeamMembers ? (
                                                        <Button
                                                            variant="link"
                                                            className="cursor-pointer ml-6 text-sm text-red-500"
                                                            onClick={() => confirmTeamMemberRemoval(user)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    ) : null}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            ) : null}

            {page.props.auth.user && (
                <div>
                    <div className="hidden sm:block">
                        <div className="py-8">
                            <Separator />
                        </div>
                    </div>

                    <div className="mt-10 sm:mt-0 md:grid md:grid-cols-3 md:gap-6">
                        <div className="md:col-span-1">
                            <div className="px-4 sm:px-0">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Leave Team
                                </h3>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    If you choose to leave, you will no longer have access to any
                                    of this team's resources.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 md:mt-0 md:col-span-2">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="max-w-xl text-sm text-gray-600 dark:text-gray-400">
                                        If you choose to leave, you will no longer have access to any of this team's resources.
                                    </div>

                                    <div className="mt-5">
                                        <Button variant="destructive" onClick={confirmLeavingTeam}>
                                            Leave
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}

            {/* <!-- Role Management Modal --> */}
            <Dialog
                open={currentlyManagingRole}
                onOpenChange={setCurrentlyManagingRole}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Role</DialogTitle>
                        <DialogDescription>
                            Select the new role for this team member.
                        </DialogDescription>
                    </DialogHeader>
                    {managingRoleFor ? (
                        <div className="relative z-0 mt-1 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer">
                            {availableRoles.map((role, i) => (
                                <button
                                    type="button"
                                    className={classNames(
                                        'relative px-4 py-3 inline-flex w-full rounded-lg focus:z-10 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600',
                                        {
                                            'border-t border-gray-200 dark:border-gray-700 focus:border-none rounded-t-none':
                                                i > 0,
                                            'rounded-b-none':
                                                i != Object.keys(availableRoles).length - 1,
                                        },
                                    )}
                                    onClick={() => updateRoleForm.setData('role', role.key)}
                                    key={role.key}
                                >
                                    <div
                                        className={classNames({
                                            'opacity-50':
                                                updateRoleForm.data.role &&
                                                updateRoleForm.data.role != role.key,
                                        })}
                                    >
                                        {/* <!-- Role Name --> */}
                                        <div className="flex items-center">
                                            <div
                                                className={classNames(
                                                    'text-sm text-gray-600 dark:text-gray-400',
                                                    {
                                                        'font-semibold':
                                                            updateRoleForm.data.role == role.key,
                                                    },
                                                )}
                                            >
                                                {role.name}
                                            </div>

                                            {updateRoleForm.data.role == role.key ? (
                                                <svg
                                                    className="ml-2 h-5 w-5 text-green-400"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            ) : null}
                                        </div>

                                        {/* <!-- Role Description --> */}
                                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                            {role.description}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : null}
                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setCurrentlyManagingRole(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            className="ml-2"
                            onClick={updateRole}
                            disabled={updateRoleForm.processing}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* <!-- Leave Team Confirmation Modal --> */}
            <Dialog
                open={confirmingLeavingTeam}
                onOpenChange={setConfirmingLeavingTeam}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Leave Team</DialogTitle>
                        <DialogDescription>
                            Are you sure you would like to leave this team?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setConfirmingLeavingTeam(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="destructive"
                            className="ml-2"
                            onClick={leaveTeam}
                            disabled={leaveTeamForm.processing}
                        >
                            Leave
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* <!-- Remove Team Member Confirmation Modal --> */}
            <Dialog
                open={!!teamMemberBeingRemoved}
                onOpenChange={open => !open && setTeamMemberBeingRemoved(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove Team Member</DialogTitle>
                        <DialogDescription>
                            Are you sure you would like to remove this person from the team?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setTeamMemberBeingRemoved(null)}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="destructive"
                            className="ml-2"
                            onClick={removeTeamMember}
                            disabled={removeTeamMemberForm.processing}
                        >
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
