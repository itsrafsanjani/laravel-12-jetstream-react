import { AppContent } from '@/Components/AppContent';
import { AppShell } from '@/Components/AppShell';
import { AppSidebar } from '@/Components/AppSidebar';
import { AppSidebarHeader } from '@/Components/AppSidebarHeader';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
