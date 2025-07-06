'use client';

import { ChevronsUpDown, Circle, CircleCheck, Plus, Settings2 } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/Components/ui/sidebar';
import { Team, User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLogo from './AppLogo';

export function AppTeamSwitcher({ user, teams }: { user: User; teams: Team[] }) {
    const { isMobile } = useSidebar();
    const [activeTeam, setActiveTeam] = useState(teams.find((team) => team.id === user.current_team_id));

    if (!activeTeam) {
        return null;
    }

    function switchToTeam(team: Team) {
        router.put(
            route('current-team.update'),
            {
                team_id: team.id,
            },
            {
                onSuccess: () => setActiveTeam(team),
            },
        );
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <AppLogo />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{activeTeam.name}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">Teams</DropdownMenuLabel>
                        {teams.map((team) => (
                            <DropdownMenuItem key={team.id} onClick={() => switchToTeam(team)} className="gap-2 p-2">
                                <div className="flex size-6 items-center justify-center rounded-md border">
                                    {team.id === user.current_team_id ? (
                                        <CircleCheck className="size-4 text-green-500"></CircleCheck>
                                    ) : (
                                        <Circle className="size-4" />
                                    )}
                                </div>
                                {team.name}
                            </DropdownMenuItem>
                        ))}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                            <Link href={route('teams.show', activeTeam.id)} className="gap-2 p-2">
                                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                    <Settings2 className="size-4" />
                                </div>
                                <div className="font-medium text-muted-foreground">Team Settings</div>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={route('teams.create')} className="gap-2 p-2">
                                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                    <Plus className="size-4" />
                                </div>
                                <div className="font-medium text-muted-foreground">Create New Team</div>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
