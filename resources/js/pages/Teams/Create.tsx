import CreateTeamForm from '@/Pages/Teams/Partials/CreateTeamForm';
import AppLayout from '@/Layouts/AppLayout';
import Heading from '@/Components/Heading';
import { BreadcrumbItem } from '@/types';
import useRoute from '@/Hooks/useRoute';
import TeamsLayout from '@/Layouts/teams/Layout';

export default function Create() {
    const route = useRoute();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Teams',
            href: route('teams.show', { team: '' }), // The team id will be injected by the layout
        },
        {
            title: 'Create Team',
            href: route('teams.create'),
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TeamsLayout>
            <div className="px-4 py-6">
                <Heading title="Create Team" description="Start collaborating with others by creating a new team" />

                <div className="mt-8 max-w-xl">
                    <CreateTeamForm />
                </div>
            </div>
            </TeamsLayout>
        </AppLayout>
    );
}
