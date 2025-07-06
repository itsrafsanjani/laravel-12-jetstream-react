import CreateTeamForm from '@/Pages/Teams/Partials/CreateTeamForm';
import AppLayout from '@/Layouts/AppLayout';
import { BreadcrumbItem } from '@/types';
import Heading from '@/Components/Heading';
import useRoute from '@/Hooks/useRoute';

export default function Create() {
    const route = useRoute();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Teams',
            href: route('teams.show', { team: '' }), // The team id will be injected by the layout
        },
        {
            title: 'Create',
            href: route('teams.create'),
        }
    ];
    return (
        <AppLayout
            breadcrumbs={breadcrumbs}
        >
            <Heading
                title="Create Team"
                description="Create a new team to collaborate with others on projects."
            />
            <CreateTeamForm />
        </AppLayout>
    );
}
