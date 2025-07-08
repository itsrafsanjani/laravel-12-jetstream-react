import useRoute from '@/Hooks/useRoute';
import AppLayout from '@/Layouts/AppLayout';
import TeamsLayout from '@/Layouts/teams/Layout';
import DeleteTeamForm from '@/Pages/Teams/Partials/DeleteTeamForm';
import TeamMemberManager from '@/Pages/Teams/Partials/TeamMemberManager';
import UpdateTeamNameForm from '@/Pages/Teams/Partials/UpdateTeamNameForm';
import { BreadcrumbItem, JetstreamTeamPermissions, Role, Team, TeamInvitation, User } from '@/types';
import { Head } from '@inertiajs/react';

interface UserMembership extends User {
    membership: {
        role: string;
    };
}

interface Props {
    team: Team & {
        owner: User;
        team_invitations: TeamInvitation[];
        users: UserMembership[];
    };
    availableRoles: Role[];
    permissions: JetstreamTeamPermissions;
}

export default function Show({ team, availableRoles, permissions }: Props) {
    const route = useRoute();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Teams',
            href: route('teams.show', { team: team.id }),
        },
        {
            title: team.name,
            href: route('teams.show', { team: team.id }),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Team Settings" />

            <TeamsLayout>
                <UpdateTeamNameForm team={team} permissions={permissions} />

                <TeamMemberManager
                    team={team}
                    availableRoles={availableRoles}
                    userPermissions={permissions}
                />

                {permissions.canDeleteTeam && !team.personal_team && (
                    <DeleteTeamForm team={team} />
                )}
            </TeamsLayout>
        </AppLayout>
    );
}
