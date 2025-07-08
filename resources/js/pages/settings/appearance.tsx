import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/Components/AppearanceTabs';
import HeadingSmall from '@/Components/HeadingSmall';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/Layouts/AppLayout';
import SettingsLayout from '@/Layouts/settings/SettingsLayout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance Settings',
        href: '/Settings/appearance',
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
