import ActionMessage from '@/Components/ActionMessage';
import FormSection from '@/Components/FormSection';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
        <FormSection
            onSubmit={updateTeamName}
            title={'Team Name'}
            description={`The team's name and owner information.`}
            renderActions={
                permissions.canUpdateTeam
                    ? () => (
                          <>
                              <ActionMessage on={form.recentlySuccessful} className="mr-3">
                                  Saved.
                              </ActionMessage>

                              <PrimaryButton className={classNames({ 'opacity-25': form.processing })} disabled={form.processing}>
                                  Save
                              </PrimaryButton>
                          </>
                      )
                    : undefined
            }
        >
            {/* <!-- Team Owner Information --> */}
            <div className="col-span-6">
                <InputLabel value="Team Owner" />

                <div className="mt-2 flex items-center">
                    <img className="h-12 w-12 rounded-full object-cover" src={team.owner.profile_photo_url} alt={team.owner.name} />

                    <div className="ml-4 leading-tight">
                        <div className="text-gray-900 dark:text-white">{team.owner.name}</div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">{team.owner.email}</div>
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
                        onChange={(e) => form.setData('name', e.target.value)}
                        required
                        autoComplete="name"
                        placeholder="Full name"
                    />

                    <InputError className="mt-2" message={form.errors.name} />
                </div>
            </div>
        </FormSection>
    );
}
