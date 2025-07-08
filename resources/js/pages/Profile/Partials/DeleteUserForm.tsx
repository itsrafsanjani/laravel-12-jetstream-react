import { useForm } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import InputError from '@/Components/ui/InputError';
import HeadingSmall from '@/Components/HeadingSmall';
import { cn } from '@/lib/utils';

export default function DeleteUserForm() {
    const route = useRoute();
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const form = useForm({
        password: '',
    });
    const passwordRef = useRef<HTMLInputElement>(null);

    function confirmUserDeletion() {
        setConfirmingUserDeletion(true);

        setTimeout(() => passwordRef.current?.focus(), 250);
    }

    function deleteUser() {
        form.delete(route('current-user.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordRef.current?.focus(),
            onFinish: () => form.reset(),
        });
    }

    function closeModal() {
        setConfirmingUserDeletion(false);
        form.reset();
    }

    return (
        <div className="space-y-6">
            <HeadingSmall
                title="Delete Account"
                description="Permanently delete your account."
            />
            <div className="space-y-6">
                <div className="max-w-xl text-sm text-gray-600 dark:text-gray-400">
                    Once your account is deleted, all of its resources and data will
                    be permanently deleted. Before deleting your account, please
                    download any data or information that you wish to retain.
                </div>

                <div>
                    <Dialog
                        open={confirmingUserDeletion}
                        onOpenChange={setConfirmingUserDeletion}
                    >
                        <DialogTrigger asChild>
                            <Button variant="destructive" onClick={confirmUserDeletion}>
                                Delete Account
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Account</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete your account? Once your
                                    account is deleted, all of its resources and data will be
                                    permanently deleted. Please enter your password to
                                    confirm you would like to permanently delete your
                                    account.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4">
                                <Input
                                    ref={passwordRef}
                                    type="password"
                                    className="mt-1 block w-3/4"
                                    placeholder="Password"
                                    value={form.data.password}
                                    onChange={e =>
                                        form.setData('password', e.currentTarget.value)
                                    }
                                />

                                <InputError
                                    message={form.errors.password}
                                    className="mt-2"
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="secondary" onClick={closeModal}>
                                    Cancel
                                </Button>

                                <Button
                                    variant="destructive"
                                    onClick={deleteUser}
                                    className={cn('ml-2', {
                                        'opacity-25': form.processing,
                                    })}
                                    disabled={form.processing}
                                >
                                    Delete Account
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
