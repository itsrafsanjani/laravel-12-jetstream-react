import Heading from '@/Components/heading';
import { Separator } from '@/Components/ui/separator';
import useRoute from '@/Hooks/useRoute';
import AppLayout from '@/Layouts/AppLayout';
import DeleteTeamForm from '@/Pages/Teams/Partials/DeleteTeamForm';
import TeamMemberManager from '@/Pages/Teams/Partials/TeamMemberManager';
import UpdateTeamNameForm from '@/Pages/Teams/Partials/UpdateTeamNameForm';
import { BreadcrumbItem, JetstreamTeamPermissions, Role, Team, TeamInvitation, User } from '@/types';

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
            title: 'Team Settings',
            href: route('teams.show', { team: team.id }),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div>
                <div className="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
                    <Heading title="Team Settings" description="Manage your team's settings." />
                    <UpdateTeamNameForm team={team} permissions={permissions} />

                    <div className="mt-10 sm:mt-0">
                        <TeamMemberManager team={team} availableRoles={availableRoles} userPermissions={permissions} />
                    </div>

                    {permissions.canDeleteTeam && !team.personal_team ? (
                        <>
                            <div className="hidden sm:block">
                                <div className="py-8">
                                    <Separator />
                                </div>
                            </div>

                            <div className="mt-10 sm:mt-0">
                                <DeleteTeamForm team={team} />
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </AppLayout>
    );
}
