import { useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useRef } from 'react';
import useRoute from '@/Hooks/useRoute';
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
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="md:col-span-1">
        <div className="px-4 sm:px-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Update Password
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Ensure your account is using a long, random password to stay
            secure.
          </p>
        </div>
      </div>
      <div className="mt-5 md:mt-0 md:col-span-2">
        <form
          onSubmit={e => {
            e.preventDefault();
            updatePassword();
          }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <Label htmlFor="current_password">Current Password</Label>
                  <Input
                    id="current_password"
                    type="password"
                    className="mt-1 block w-full"
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

                <div className="col-span-6 sm:col-span-4">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    className="mt-1 block w-full"
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

                <div className="col-span-6 sm:col-span-4">
                  <Label htmlFor="password_confirmation">
                    Confirm Password
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    className="mt-1 block w-full"
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
              <div className="flex items-center justify-end text-right">
                <ActionMessage
                  on={form.recentlySuccessful}
                  className="mr-3"
                >
                  Saved.
                </ActionMessage>

                <Button
                  className={classNames({
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
    </div>
  );
}
