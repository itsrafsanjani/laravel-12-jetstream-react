import { useForm } from '@inertiajs/react';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import InputError from '@/Components/ui/InputError';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import HeadingSmall from '@/Components/HeadingSmall';
import { cn } from '@/lib/utils';
import { Transition } from '@headlessui/react';

export default function CreateTeamForm() {
    const route = useRoute();
    const page = useTypedPage();
    const form = useForm({
        name: '',
    });

    function createTeam() {
        form.post(route('teams.store'), {
            errorBag: 'createTeam',
            preserveScroll: true,
        });
    }

    return (
        <div className="space-y-6">
            <HeadingSmall title="New team" description="Create a new team to collaborate with others on projects" />

            <div className="space-y-6">
                <div className="grid gap-2">
                    <Label className="text-sm font-medium">Team Owner</Label>
                    <div className="flex items-center space-x-3">
                        <Avatar>
                            <AvatarImage
                                src={page.props.auth.user?.profile_photo_url}
                                alt={page.props.auth.user?.name}
                            />
                            <AvatarFallback>
                                {page.props.auth.user?.name?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">
                                {page.props.auth.user?.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {page.props.auth.user?.email}
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={e => {
                        e.preventDefault();
                        createTeam();
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="name">Team Name</Label>
                        <Input
                            id="name"
                            type="text"
                            className="mt-1 block w-full"
                            placeholder="Enter team name"
                            value={form.data.name}
                            onChange={e =>
                                form.setData('name', e.currentTarget.value)
                            }
                            autoFocus
                        />
                        <InputError className="mt-2" message={form.errors.name} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className={cn({ 'opacity-50': form.processing })}
                        >
                            Create Team
                        </Button>

                        <Transition
                            show={form.recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">Team created successfully</p>
                        </Transition>
                    </div>
                </form>
            </div>
        </div>
    );
}
