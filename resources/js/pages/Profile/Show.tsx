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
      <SettingsLayout>
        <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
          {page.props.jetstream.canUpdateProfileInformation ? (
            <div>
              <UpdateProfileInformationForm user={page.props.auth.user!} />

              <div className="hidden sm:block">
                <div className="py-8">
                  <Separator />
                </div>
              </div>
            </div>
          ) : null}

          {page.props.jetstream.canUpdatePassword ? (
            <div className="mt-10 sm:mt-0">
              <UpdatePasswordForm />

              <div className="hidden sm:block">
                <div className="py-8">
                  <Separator />
                </div>
              </div>
            </div>
          ) : null}

          {page.props.jetstream.canManageTwoFactorAuthentication ? (
            <div className="mt-10 sm:mt-0">
              <TwoFactorAuthenticationForm
                requiresConfirmation={confirmsTwoFactorAuthentication}
              />

              <div className="hidden sm:block">
                <div className="py-8">
                  <Separator />
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-10 sm:mt-0">
            <LogoutOtherBrowserSessions sessions={sessions} />
          </div>

          {page.props.jetstream.hasAccountDeletionFeatures ? (
            <>
              <div className="hidden sm:block">
                <div className="py-8">
                  <Separator />
                </div>
              </div>

              <div className="mt-10 sm:mt-0">
                <DeleteUserForm />
              </div>
            </>
          ) : null}
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
