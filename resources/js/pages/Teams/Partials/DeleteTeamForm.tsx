import useRoute from '@/Hooks/useRoute';
import ActionSection from '@/Components/ActionSection';
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
    <ActionSection
      title={'Delete Team'}
      description={'Permanently delete this team.'}
    >
      <div className="max-w-xl text-sm text-gray-600 dark:text-gray-400">
        Once a team is deleted, all of its resources and data will be
        permanently deleted. Before deleting this team, please download any data
        or information regarding this team that you wish to retain.
      </div>

      <div className="mt-5">
        <Dialog open={confirmingTeamDeletion} onOpenChange={setConfirmingTeamDeletion}>
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
    </ActionSection>
  );
}
