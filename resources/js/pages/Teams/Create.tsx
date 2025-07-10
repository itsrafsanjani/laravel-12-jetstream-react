import useRoute from '@/Hooks/useRoute';
import AppLayout from '@/Layouts/AppLayout';
import TeamsLayout from '@/Layouts/teams/Layout';
import CreateTeamForm from '@/Pages/Teams/Partials/CreateTeamForm';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

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
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Team" />

            <TeamsLayout>
                <CreateTeamForm />
            </TeamsLayout>
        </AppLayout>
    );
}
