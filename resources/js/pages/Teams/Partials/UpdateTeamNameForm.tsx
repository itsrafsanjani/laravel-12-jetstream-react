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
import Heading from '@/Components/Heading';
import { cn } from '@/lib/utils';

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
        <div>
            <Heading
                title="Team Name"
                description="The team's name and owner information."
            />
            <form
                onSubmit={e => {
                    e.preventDefault();
                    updateTeamName();
                }}
            >
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {/* <!-- Team Owner Information --> */}
                            <div>
                                <Label>Team Owner</Label>

                                <div className="mt-2 flex items-center">
                                    <img
                                        className="h-12 w-12 rounded-full object-cover"
                                        src={team.owner.profile_photo_url}
                                        alt={team.owner.name}
                                    />

                                    <div className="ml-4 leading-tight">
                                        <div>
                                            {team.owner.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {team.owner.email}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Team Name --> */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Team Name</Label>

                                <Input
                                    id="name"
                                    className="w-full"
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
                    </CardContent>

                    {permissions.canUpdateTeam && (
                        <CardFooter>
                            <div className="flex items-center justify-end text-right w-full">
                                {form.recentlySuccessful && (
                                    <p className="text-sm text-gray-600 mr-3">
                                        Saved.
                                    </p>
                                )}
                                <Button
                                    className={cn({
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
    );
}
