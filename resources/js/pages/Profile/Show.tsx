import { Separator } from '@/Components/ui/separator';
import useTypedPage from '@/Hooks/useTypedPage';
import AppLayout from '@/Layouts/AppLayout';
import SettingsLayout from '@/Layouts/settings/SettingsLayout';
import DeleteUserForm from '@/Pages/Profile/Partials/DeleteUserForm';
import LogoutOtherBrowserSessions from '@/Pages/Profile/Partials/LogoutOtherBrowserSessionsForm';
import TwoFactorAuthenticationForm from '@/Pages/Profile/Partials/TwoFactorAuthenticationForm';
import UpdateProfileInformationForm from '@/Pages/Profile/Partials/UpdateProfileInformationForm';
import { BreadcrumbItem, Session } from '@/types';
import { Head } from '@inertiajs/react';

interface Props {
    sessions: Session[];
    confirmsTwoFactorAuthentication: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile',
        href: '/user/profile',
    },
];

export default function Show({ sessions, confirmsTwoFactorAuthentication }: Props) {
    const page = useTypedPage();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-12">
                    {page.props.jetstream.canUpdateProfileInformation ? <UpdateProfileInformationForm user={page.props.auth.user!} /> : null}

                    {page.props.jetstream.canUpdatePassword ? <Separator className="hidden sm:block" /> : null}

                    {page.props.jetstream.canManageTwoFactorAuthentication ? (
                        <TwoFactorAuthenticationForm requiresConfirmation={confirmsTwoFactorAuthentication} />
                    ) : null}

                    <LogoutOtherBrowserSessions sessions={sessions} />

                    {page.props.jetstream.hasAccountDeletionFeatures ? <DeleteUserForm /> : null}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
