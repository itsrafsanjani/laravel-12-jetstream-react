import ActionMessage from '@/Components/ActionMessage';
import InputError from '@/Components/ui/InputError';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import useRoute from '@/Hooks/useRoute';
import { JetstreamTeamPermissions, Team, User } from '@/types';
import { useForm } from '@inertiajs/react';
import classNames from 'classnames';

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
        <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Team Name
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        The team's name and owner information.
                    </p>
                </div>
            </div>

            <div className="mt-5 md:mt-0 md:col-span-2">
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        updateTeamName();
                    }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-6 gap-6">
                                {/* <!-- Team Owner Information --> */}
                                <div className="col-span-6">
                                    <Label>Team Owner</Label>

                                    <div className="mt-2 flex items-center">
                                        <img
                                            className="h-12 w-12 rounded-full object-cover"
                                            src={team.owner.profile_photo_url}
                                            alt={team.owner.name}
                                        />

                                        <div className="ml-4 leading-tight">
                                            <div className="text-gray-900 dark:text-white">
                                                {team.owner.name}
                                            </div>
                                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                                {team.owner.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Team Name --> */}
                                <div className="col-span-6 sm:col-span-4">
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
                                            placeholder="Full name"
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={form.errors.name}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        {permissions.canUpdateTeam && (
                            <CardFooter>
                                <div className="flex items-center justify-end text-right">
                                    <ActionMessage
                                        on={form.recentlySuccessful}
                                        className="mr-3"
                                    >
                                        Saved.
                                    </ActionMessage>

                                    <Button
                                        className={classNames({
                                            'opacity-25': form.processing,
                                        })}
                                        disabled={form.processing}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </CardFooter>
                        )}
                    </Card>
                </form>
            </div>
        </div>
    );
}
