import { NavFooter } from '@/Components/NavFooter';
import { NavMain } from '@/Components/NavMain';
import { NavUser } from '@/Components/NavUser';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/Components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import { AppTeamSwitcher } from './AppTeamSwitcher';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    // {
    //     title: 'Team Settings',
    //     href: route('teams.show', 1),
    //     icon: LayoutGrid,
    // },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    if (!auth.user) {
        return null;
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <AppTeamSwitcher user={auth.user} teams={auth.user.all_teams || []} />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
