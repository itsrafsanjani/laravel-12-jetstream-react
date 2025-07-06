import CreateTeamForm from '@/Pages/Teams/Partials/CreateTeamForm';
import AppLayout from '@/Layouts/AppLayout';

export default function Create() {
    return (
        <AppLayout
            title="Create Team"
            renderHeader={() => <h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">Create Team</h2>}
        >
            <div>
                <div className="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
                    <CreateTeamForm />
                </div>
            </div>
        </AppLayout>
    );
}
