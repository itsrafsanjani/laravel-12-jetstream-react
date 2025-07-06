import useRoute from '@/Hooks/useRoute';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import {
  Card,
  CardContent,
} from '@/Components/ui/card';
import { Team } from '@/types';
import { useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useState } from 'react';

interface Props {
  team: Team;
}

export default function DeleteTeamForm({ team }: Props) {
  const route = useRoute();
  const [confirmingTeamDeletion, setConfirmingTeamDeletion] = useState(false);
  const form = useForm({});

  function deleteTeam() {
    form.delete(route('teams.destroy', [team]), {
      errorBag: 'deleteTeam',
    });
  }

  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="md:col-span-1">
        <div className="px-4 sm:px-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Delete Team
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Permanently delete this team.
          </p>
        </div>
      </div>

      <div className="mt-5 md:mt-0 md:col-span-2">
        <Card>
          <CardContent className="p-6">
            <div className="max-w-xl text-sm text-gray-600 dark:text-gray-400">
              Once a team is deleted, all of its resources and data will be
              permanently deleted. Before deleting this team, please download
              any data or information regarding this team that you wish to
              retain.
            </div>

            <div className="mt-5">
              <Dialog
                open={confirmingTeamDeletion}
                onOpenChange={setConfirmingTeamDeletion}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete Team</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Team</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this team? Once a team is
                      deleted, all of its resources and data will be permanently
                      deleted.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="secondary"
                      onClick={() => setConfirmingTeamDeletion(false)}
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={deleteTeam}
                      className={classNames('ml-2', {
                        'opacity-25': form.processing,
                      })}
                      disabled={form.processing}
                    >
                      Delete Team
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
