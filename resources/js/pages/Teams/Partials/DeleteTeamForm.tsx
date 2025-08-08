import HeadingSmall from '@/Components/HeadingSmall';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { cn } from '@/lib/utils';
import { Team } from '@/types';
import { useForm } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface Props {
    team: Team;
}

export default function DeleteTeamForm({ team }: Props) {
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

            <div className="rounded-md border border-red-200 bg-red-50 p-4">
                <p className="mb-4 text-sm text-red-800">
                    Once a team is deleted, all of its resources and data will be permanently deleted. Before deleting this team, please download any
                    data or information regarding this team that you wish to retain.
                </p>
                <p className="mb-4 text-sm text-red-800">Please proceed with caution, this cannot be undone.</p>

                <Dialog open={confirmingTeamDeletion} onOpenChange={setConfirmingTeamDeletion}>
                    <DialogTrigger asChild>
                        <Button variant="destructive">Delete Team</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                Delete Team
                            </DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete "{team.name}"? This action cannot be undone. All team resources and data will be
                                permanently deleted.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setConfirmingTeamDeletion(false)}>
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
