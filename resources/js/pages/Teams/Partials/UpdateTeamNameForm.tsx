import InputError from '@/Components/ui/InputError';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import HeadingSmall from '@/Components/HeadingSmall';
import useRoute from '@/Hooks/useRoute';
import { JetstreamTeamPermissions, Team, User } from '@/types';
import { useForm } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Transition } from '@headlessui/react';

interface Props {
    team: Team & { owner: User };
    permissions: JetstreamTeamPermissions;
}

export default function UpdateTeamNameForm({ team, permissions }: Props) {
    const route = useRoute();
    const form = useForm({
        name: team.name,
    });

    function updateTeamName() {
        form.put(route('teams.update', [team]), {
            errorBag: 'updateTeamName',
            preserveScroll: true,
        });
    }

    return (
        <div className="space-y-6">
            <HeadingSmall title="Team information" description="Update your team's name and view owner information" />

            <div className="space-y-6">
                <div className="grid gap-2">
                    <Label className="text-sm font-medium">Team Owner</Label>
                    <div className="flex items-center space-x-3">
                        <Avatar>
                            <AvatarImage
                                src={team.owner.profile_photo_url}
                                alt={team.owner.name}
                            />
                            <AvatarFallback>
                                {team.owner.name?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">
                                {team.owner.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {team.owner.email}
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={e => {
                        e.preventDefault();
                        updateTeamName();
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="name">Team Name</Label>
                        <Input
                            id="name"
                            className="mt-1 block w-full"
                            value={form.data.name}
                            onChange={e =>
                                form.setData('name', e.target.value)
                            }
                            required
                            autoComplete="name"
                            placeholder="Enter team name"
                            disabled={!permissions.canUpdateTeam}
                        />
                        <InputError className="mt-2" message={form.errors.name} />
                    </div>

                    {permissions.canUpdateTeam && (
                        <div className="flex items-center gap-4">
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className={cn({
                                    'opacity-50': form.processing,
                                })}
                            >
                                Save
                            </Button>

                            <Transition
                                show={form.recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
