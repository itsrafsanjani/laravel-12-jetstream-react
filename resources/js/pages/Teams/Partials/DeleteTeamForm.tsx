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
import HeadingSmall from '@/Components/HeadingSmall';
import { Team } from '@/types';
import { useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

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
        <div className="space-y-6">
            <HeadingSmall title="Delete team" description="Permanently delete this team and all associated data" />

            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-800 mb-4">
                    Once a team is deleted, all of its resources and data will be permanently deleted.
                    Before deleting this team, please download any data or information regarding this team that you wish to retain.
                </p>
                <p className="text-sm text-red-800 mb-4">
                    Please proceed with caution, this cannot be undone.
                </p>

                <Dialog
                    open={confirmingTeamDeletion}
                    onOpenChange={setConfirmingTeamDeletion}
                >
                    <DialogTrigger asChild>
                        <Button variant="destructive">
                            Delete Team
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                Delete Team
                            </DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete "{team.name}"? This action cannot be undone.
                                All team resources and data will be permanently deleted.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setConfirmingTeamDeletion(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={deleteTeam}
                                className={cn({
                                    'opacity-50': form.processing,
                                })}
                                disabled={form.processing}
                            >
                                {form.processing ? 'Deleting...' : 'Delete Team'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
