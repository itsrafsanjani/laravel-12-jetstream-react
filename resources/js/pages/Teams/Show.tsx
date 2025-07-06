import { Separator } from '@/Components/ui/separator';
import AppLayout from '@/Layouts/AppLayout';
import DeleteTeamForm from '@/Pages/Teams/Partials/DeleteTeamForm';
import TeamMemberManager from '@/Pages/Teams/Partials/TeamMemberManager';
import UpdateTeamNameForm from '@/Pages/Teams/Partials/UpdateTeamNameForm';
import {
    JetstreamTeamPermissions,
    Role,
    Team,
    TeamInvitation,
    User,
    BreadcrumbItem,
} from '@/types';

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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Team Settings',
        href: '/teams',
    },
];

export default function Show({ team, availableRoles, permissions }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div>
                <div className="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
                    <UpdateTeamNameForm team={team} permissions={permissions} />

                    <div className="mt-10 sm:mt-0">
                        <TeamMemberManager
                            team={team}
                            availableRoles={availableRoles}
                            userPermissions={permissions}
                        />
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
