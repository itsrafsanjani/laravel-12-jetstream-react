import { useForm } from '@inertiajs/react';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import InputError from '@/Components/ui/InputError';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/Components/ui/card';
import Heading from '@/Components/Heading';
import { cn } from '@/lib/utils';

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
    <div>
      <Heading
        title="Team Details"
        description="Create a new team to collaborate with others on projects."
      />
      <form
        onSubmit={e => {
          e.preventDefault();
          createTeam();
        }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label>Team Owner</Label>

                <div className="flex items-center mt-2">
                  <img
                    className="w-12 h-12 rounded-full object-cover"
                    src={page.props.auth.user?.profile_photo_url}
                    alt={page.props.auth.user?.name}
                  />

                  <div className="ml-4 leading-tight">
                    <div>
                      {page.props.auth.user?.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {page.props.auth.user?.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Team Name</Label>
                <Input
                  id="name"
                  type="text"
                  className="w-full"
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
            <div className="flex items-center justify-end text-right w-full">
              {form.recentlySuccessful && (
                <p className="text-sm text-gray-600 mr-3">
                  Saved.
                </p>
              )}
              <Button
                className={cn({ 'opacity-25': form.processing })}
                disabled={form.processing}
              >
                Save
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
