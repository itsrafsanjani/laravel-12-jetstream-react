import { useForm } from '@inertiajs/react';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import ActionMessage from '@/Components/ActionMessage';
import InputError from '@/Components/ui/InputError';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/Components/ui/card';
import classNames from 'classnames';

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
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="md:col-span-1">
        <div className="px-4 sm:px-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Team Details
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Create a new team to collaborate with others on projects.
          </p>
        </div>
      </div>

      <div className="mt-5 md:mt-0 md:col-span-2">
        <form
          onSubmit={e => {
            e.preventDefault();
            createTeam();
          }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <Label>Team Owner</Label>

                  <div className="flex items-center mt-2">
                    <img
                      className="w-12 h-12 rounded-full object-cover"
                      src={page.props.auth.user?.profile_photo_url}
                      alt={page.props.auth.user?.name}
                    />

                    <div className="ml-4 leading-tight">
                      <div className="text-gray-900 dark:text-white">
                        {page.props.auth.user?.name}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 text-sm">
                        {page.props.auth.user?.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <Label htmlFor="name">Team Name</Label>
                  <Input
                    id="name"
                    type="text"
                    className="mt-1 block w-full"
                    value={form.data.name}
                    onChange={e =>
                      form.setData('name', e.currentTarget.value)
                    }
                    autoFocus
                  />
                  <InputError message={form.errors.name} className="mt-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-end text-right">
                <ActionMessage
                  on={form.recentlySuccessful}
                  className="mr-3"
                >
                  Saved.
                </ActionMessage>

                <Button
                  className={classNames({ 'opacity-25': form.processing })}
                  disabled={form.processing}
                >
                  Save
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
