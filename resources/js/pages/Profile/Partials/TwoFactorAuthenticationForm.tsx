import { router, useForm } from '@inertiajs/react';
import axios, { AxiosResponse } from 'axios';
import classNames from 'classnames';
import React, { useState } from 'react';
import ConfirmsPassword from '@/Components/ConfirmsPassword';
import { Button } from '@/Components/ui/button';
import {
  Card,
  CardContent,
} from '@/Components/ui/card';
import InputError from '@/Components/ui/InputError';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import useTypedPage from '@/Hooks/useTypedPage';

interface Props {
  requiresConfirmation: boolean;
}

export default function TwoFactorAuthenticationForm({
  requiresConfirmation,
}: Props) {
  const page = useTypedPage();
  const [enabling, setEnabling] = useState(false);
  const [disabling, setDisabling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [setupKey, setSetupKey] = useState<string | null>(null);
  const confirmationForm = useForm({
    code: '',
  });
  const twoFactorEnabled =
    !enabling && page.props?.auth?.user?.two_factor_enabled;

  function enableTwoFactorAuthentication() {
    setEnabling(true);

    router.post(
      '/user/two-factor-authentication',
      {},
      {
        preserveScroll: true,
        onSuccess() {
          return Promise.all([
            showQrCode(),
            showSetupKey(),
            showRecoveryCodes(),
          ]);
        },
        onFinish() {
          setEnabling(false);
          setConfirming(requiresConfirmation);
        },
      },
    );
  }

  function showSetupKey() {
    return axios
      .get('/user/two-factor-secret-key')
      .then((response: AxiosResponse<{ secretKey: string }>) => {
        setSetupKey(response.data.secretKey);
      });
  }

  function confirmTwoFactorAuthentication() {
    confirmationForm.post('/user/confirmed-two-factor-authentication', {
      preserveScroll: true,
      preserveState: true,
      errorBag: 'confirmTwoFactorAuthentication',
      onSuccess: () => {
        setConfirming(false);
        setQrCode(null);
        setSetupKey(null);
      },
    });
  }

  function showQrCode() {
    return axios
      .get('/user/two-factor-qr-code')
      .then((response: AxiosResponse<{ svg: string }>) => {
        setQrCode(response.data.svg);
      });
  }

  function showRecoveryCodes() {
    return axios
      .get('/user/two-factor-recovery-codes')
      .then((response: AxiosResponse<string[]>) => {
        setRecoveryCodes(response.data);
      });
  }

  function regenerateRecoveryCodes() {
    axios.post('/user/two-factor-recovery-codes').then(() => {
      showRecoveryCodes();
    });
  }

  function disableTwoFactorAuthentication() {
    setDisabling(true);

    router.delete('/user/two-factor-authentication', {
      preserveScroll: true,
      onSuccess() {
        setDisabling(false);
        setConfirming(false);
      },
    });
  }

  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="md:col-span-1">
        <div className="px-4 sm:px-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Two Factor Authentication
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Add additional security to your account using two factor
            authentication.
          </p>
        </div>
      </div>

      <div className="mt-5 md:mt-0 md:col-span-2">
        <Card>
          <CardContent className="p-6">
            {(() => {
              if (twoFactorEnabled && !confirming) {
                return (
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    You have enabled two factor authentication.
                  </h3>
                );
              }
              if (confirming) {
                return (
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Finish enabling two factor authentication.
                  </h3>
                );
              }
              return (
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  You have not enabled two factor authentication.
                </h3>
              );
            })()}

            <div className="mt-3 max-w-xl text-sm text-gray-600 dark:text-gray-400">
              <p>
                When two factor authentication is enabled, you will be prompted
                for a secure, random token during authentication. You may
                retrieve this token from your phone's Google Authenticator
                application.
              </p>
            </div>

            {twoFactorEnabled || confirming ? (
              <div>
                {qrCode ? (
                  <div>
                    <div className="mt-4 max-w-xl text-sm text-gray-600 dark:text-gray-400">
                      {confirming ? (
                        <p className="font-semibold">
                          To finish enabling two factor authentication, scan the
                          following QR code using your phone's authenticator
                          application or enter the setup key and provide the
                          generated OTP code.
                        </p>
                      ) : (
                        <p>
                          Two factor authentication is now enabled. Scan the
                          following QR code using your phone's authenticator
                          application or enter the setup key.
                        </p>
                      )}
                    </div>

                    <div
                      className="mt-4"
                      dangerouslySetInnerHTML={{ __html: qrCode || '' }}
                    />

                    {setupKey && (
                      <div className="mt-4 max-w-xl text-sm text-gray-600 dark:text-gray-400">
                        <p className="font-semibold">
                          Setup Key:{' '}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: setupKey || '',
                            }}
                          />
                        </p>
                      </div>
                    )}

                    {confirming && (
                      <div className="mt-4">
                        <Label htmlFor="code">Code</Label>

                        <Input
                          id="code"
                          type="text"
                          name="code"
                          className="block mt-1 w-1/2"
                          inputMode="numeric"
                          autoFocus={true}
                          autoComplete="one-time-code"
                          value={confirmationForm.data.code}
                          onChange={e =>
                            confirmationForm.setData(
                              'code',
                              e.currentTarget.value,
                            )
                          }
                        />

                        <InputError
                          message={confirmationForm.errors.code}
                          className="mt-2"
                        />
                      </div>
                    )}
                  </div>
                ) : null}

                {recoveryCodes.length > 0 && !confirming ? (
                  <div>
                    <div className="mt-4 max-w-xl text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-semibold">
                        Store these recovery codes in a secure password
                        manager. They can be used to recover access to your
                        account if your two factor authentication device is
                        lost.
                      </p>
                    </div>

                    <div className="grid gap-1 max-w-xl mt-4 px-4 py-4 font-mono text-sm bg-gray-100 dark:bg-gray-900 rounded-lg">
                      {recoveryCodes.map(code => (
                        <div key={code}>{code}</div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="mt-5">
              {twoFactorEnabled || confirming ? (
                <div>
                  {confirming ? (
                    <ConfirmsPassword
                      onConfirm={confirmTwoFactorAuthentication}
                    >
                      <Button
                        className={classNames('mr-3', {
                          'opacity-25': enabling,
                        })}
                        disabled={enabling}
                      >
                        Confirm
                      </Button>
                    </ConfirmsPassword>
                  ) : null}
                  {recoveryCodes.length > 0 && !confirming ? (
                    <ConfirmsPassword onConfirm={regenerateRecoveryCodes}>
                      <Button variant="secondary" className="mr-3">
                        Regenerate Recovery Codes
                      </Button>
                    </ConfirmsPassword>
                  ) : null}
                  {recoveryCodes.length === 0 && !confirming ? (
                    <ConfirmsPassword onConfirm={showRecoveryCodes}>
                      <Button variant="secondary" className="mr-3">
                        Show Recovery Codes
                      </Button>
                    </ConfirmsPassword>
                  ) : null}

                  {confirming ? (
                    <ConfirmsPassword
                      onConfirm={disableTwoFactorAuthentication}
                    >
                      <Button
                        variant="secondary"
                        className={classNames('mr-3', {
                          'opacity-25': disabling,
                        })}
                        disabled={disabling}
                      >
                        Cancel
                      </Button>
                    </ConfirmsPassword>
                  ) : (
                    <ConfirmsPassword
                      onConfirm={disableTwoFactorAuthentication}
                    >
                      <Button
                        variant="destructive"
                        className={classNames({ 'opacity-25': disabling })}
                        disabled={disabling}
                      >
                        Disable
                      </Button>
                    </ConfirmsPassword>
                  )}
                </div>
              ) : (
                <div>
                  <ConfirmsPassword onConfirm={enableTwoFactorAuthentication}>
                    <Button
                      type="button"
                      className={classNames({ 'opacity-25': enabling })}
                      disabled={enabling}
                    >
                      Enable
                    </Button>
                  </ConfirmsPassword>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
