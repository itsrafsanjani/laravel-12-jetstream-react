import { AppContent } from '@/Components/AppContent';
import { AppHeader } from '@/Components/AppHeader';
import { AppShell } from '@/Components/AppShell';
import { Banner } from '@/Components/Banner';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />
            <Banner />
            <AppContent>{children}</AppContent>
        </AppShell>
    );
}
