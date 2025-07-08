import React from 'react';
import DeleteUserForm from '@/Pages/Profile/Partials/DeleteUserForm';
import LogoutOtherBrowserSessions from '@/Pages/Profile/Partials/LogoutOtherBrowserSessionsForm';
import TwoFactorAuthenticationForm from '@/Pages/Profile/Partials/TwoFactorAuthenticationForm';
import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from '@/Pages/Profile/Partials/UpdateProfileInformationForm';
import useTypedPage from '@/Hooks/useTypedPage';
import { Separator } from '@/Components/ui/separator';
import AppLayout from '@/Layouts/AppLayout';
import { Session, BreadcrumbItem } from '@/types';
import SettingsLayout from '@/Layouts/settings/SettingsLayout';
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

export default function Show({
  sessions,
  confirmsTwoFactorAuthentication,
}: Props) {
  const page = useTypedPage();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Profile settings" />

      <SettingsLayout>
        <div className="space-y-12">
          {page.props.jetstream.canUpdateProfileInformation ? (
            <>
              <UpdateProfileInformationForm user={page.props.auth.user!} />
              <Separator className="hidden sm:block" />
            </>
          ) : null}

          {page.props.jetstream.canUpdatePassword ? (
            <>
              <UpdatePasswordForm />
              <Separator className="hidden sm:block" />
            </>
          ) : null}

          {page.props.jetstream.canManageTwoFactorAuthentication ? (
            <>
              <TwoFactorAuthenticationForm
                requiresConfirmation={confirmsTwoFactorAuthentication}
              />
              <Separator className="hidden sm:block" />
            </>
          ) : null}

          <LogoutOtherBrowserSessions sessions={sessions} />

          {page.props.jetstream.hasAccountDeletionFeatures ? (
            <>
              <Separator className="hidden sm:block" />
              <DeleteUserForm />
            </>
          ) : null}
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
