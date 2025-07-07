import Heading from '@/Components/Heading';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import useTypedPage from '@/Hooks/useTypedPage';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function TeamsLayout({ children }: PropsWithChildren) {
    const team = useTypedPage().props.auth.user?.current_team;

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;


    const sidebarNavItems: NavItem[] = [
        {
            title: 'Team Settings',
            href: `/teams/${team?.id}`,
            icon: null,
        },
        {
            title: 'Create Team',
            href: `/teams/create`,
            icon: null,
        },
    ];

    return (
        <div className="px-4 py-6">
            <Heading title={team?.name || 'Team'} description="Manage your team settings and members" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === item.href,
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
