import { useForm } from '@inertiajs/react';
import React, { useRef } from 'react';
import useRoute from '@/Hooks/useRoute';
import InputError from '@/Components/ui/InputError';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter } from '@/Components/ui/card';
import Heading from '@/Components/Heading';
import { cn } from '@/lib/utils';

export default function UpdatePasswordForm() {
  const route = useRoute();
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
    <div>
      <Heading
        title="Update Password"
        description="Ensure your account is using a long, random password to stay secure."
      />
      <form
        onSubmit={e => {
          e.preventDefault();
          updatePassword();
        }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current Password</Label>
                <Input
                  id="current_password"
                  type="password"
                  className="w-full"
                  ref={currentPasswordRef}
                  value={form.data.current_password}
                  onChange={e =>
                    form.setData('current_password', e.currentTarget.value)
                  }
                  autoComplete="current-password"
                />
                <InputError
                  message={form.errors.current_password}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="w-full"
                  value={form.data.password}
                  onChange={e =>
                    form.setData('password', e.currentTarget.value)
                  }
                  autoComplete="new-password"
                  ref={passwordRef}
                />
                <InputError
                  message={form.errors.password}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">
                  Confirm Password
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  className="w-full"
                  value={form.data.password_confirmation}
                  onChange={e =>
                    form.setData(
                      'password_confirmation',
                      e.currentTarget.value,
                    )
                  }
                  autoComplete="new-password"
                />
                <InputError
                  message={form.errors.password_confirmation}
                  className="mt-2"
                />
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
                className={cn({
                  'opacity-25': form.processing,
                })}
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
