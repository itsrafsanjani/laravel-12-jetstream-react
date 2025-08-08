import HeadingSmall from '@/Components/HeadingSmall';
import InputError from '@/Components/ui/input-error';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { cn } from '@/lib/utils';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm() {
    const form = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const passwordRef = useRef<HTMLInputElement>(null);
    const currentPasswordRef = useRef<HTMLInputElement>(null);

    function updatePassword() {
        form.put(route('user-password.update'), {
            errorBag: 'updatePassword',
            preserveScroll: true,
            onSuccess: () => form.reset(),
            onError: () => {
                if (form.errors.password) {
                    form.reset('password', 'password_confirmation');
                    passwordRef.current?.focus();
                }

                if (form.errors.current_password) {
                    form.reset('current_password');
                    currentPasswordRef.current?.focus();
                }
            },
        });
    }

    return (
        <div className="space-y-6">
            <HeadingSmall title="Update Password" description="Ensure your account is using a long, random password to stay secure." />
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    updatePassword();
                }}
                className="space-y-6"
            >
                <div className="grid gap-2">
                    <Label htmlFor="current_password">Current Password</Label>
                    <Input
                        id="current_password"
                        type="password"
                        className="mt-1 block w-full"
                        ref={currentPasswordRef}
                        value={form.data.current_password}
                        onChange={(e) => form.setData('current_password', e.currentTarget.value)}
                        autoComplete="current-password"
                        placeholder="Current password"
                    />
                    <InputError message={form.errors.current_password} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                        id="password"
                        type="password"
                        className="mt-1 block w-full"
                        value={form.data.password}
                        onChange={(e) => form.setData('password', e.currentTarget.value)}
                        autoComplete="new-password"
                        ref={passwordRef}
                        placeholder="New password"
                    />
                    <InputError message={form.errors.password} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        className="mt-1 block w-full"
                        value={form.data.password_confirmation}
                        onChange={(e) => form.setData('password_confirmation', e.currentTarget.value)}
                        autoComplete="new-password"
                        placeholder="Confirm password"
                    />
                    <InputError message={form.errors.password_confirmation} />
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        className={cn({
                            'opacity-25': form.processing,
                        })}
                        disabled={form.processing}
                    >
                        Save Password
                    </Button>

                    <Transition
                        show={form.recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-neutral-600">Saved</p>
                    </Transition>
                </div>
            </form>
        </div>
    );
}
