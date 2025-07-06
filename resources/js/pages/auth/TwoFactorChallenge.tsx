import { useForm, Head } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import ValidationErrors from '@/Components/ui/ValidationErrors';
import AuthenticationCardLogo from '@/Components/AuthenticationCardLogo';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import InputError from '@/Components/ui/InputError';
import { Card, CardContent } from '@/Components/ui/card';

export default function TwoFactorChallenge() {
  const route = useRoute();
  const [recovery, setRecovery] = useState(false);
  const form = useForm({
    code: '',
    recovery_code: '',
  });
  const recoveryCodeRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  function toggleRecovery() {
    setRecovery(previous => {
      const isRecovery = !previous;

      if (isRecovery) {
        form.setData('code', '');
        setTimeout(() => recoveryCodeRef.current?.focus(), 100);
      } else {
        form.setData('recovery_code', '');
        setTimeout(() => codeRef.current?.focus(), 100);
      }

      return isRecovery;
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.post(route('two-factor.login'));
  }

  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
      <Head title="Two-factor Confirmation" />

      <div>
        <AuthenticationCardLogo />
      </div>

      <Card className="w-full sm:max-w-md mt-6">
        <CardContent className="py-4">
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {recovery
              ? 'Please confirm access to your account by entering one of your emergency recovery codes.'
              : 'Please confirm access to your account by entering the authentication code provided by your authenticator application.'}
          </div>

          <ValidationErrors className="mb-4" />

          <form onSubmit={onSubmit}>
            {recovery ? (
              <div>
                <Label htmlFor="recovery_code">Recovery Code</Label>
                <Input
                  id="recovery_code"
                  type="text"
                  className="mt-1 block w-full"
                  value={form.data.recovery_code}
                  autoComplete="one-time-code"
                  onChange={e => form.setData('recovery_code', e.target.value)}
                  ref={recoveryCodeRef}
                />
                <InputError
                  message={form.errors.recovery_code}
                  className="mt-2"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  className="mt-1 block w-full"
                  value={form.data.code}
                  autoFocus
                  autoComplete="one-time-code"
                  onChange={e => form.setData('code', e.target.value)}
                  ref={codeRef}
                />
                <InputError message={form.errors.code} className="mt-2" />
              </div>
            )}

            <div className="mt-4 flex items-center justify-end">
              <button
                type="button"
                className="cursor-pointer text-sm text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                onClick={toggleRecovery}
              >
                {recovery ? 'Use an authentication code' : 'Use a recovery code'}
              </button>

              <Button className="ml-4" disabled={form.processing}>
                Log in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
