import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import InputError from '@/Components/ui/input-error';
import axios, { AxiosError } from 'axios';
import classNames from 'classnames';
import { PropsWithChildren, useRef, useState } from 'react';

interface Props {
    title?: string;
    content?: string;
    button?: string;
    onConfirm(): void;
}

interface ValidationError {
    errors: {
        password: string[];
    };
}

export default function ConfirmsPassword({
    title = 'Confirm Password',
    content = 'For your security, please confirm your password to continue.',
    button = 'Confirm',
    onConfirm,
    children,
}: PropsWithChildren<Props>) {
    const [confirmingPassword, setConfirmingPassword] = useState(false);
    const [form, setForm] = useState({
        password: '',
        error: '',
        processing: false,
    });
    const passwordRef = useRef<HTMLInputElement>(null);

    function startConfirmingPassword() {
        axios.get(route('password.confirmation')).then((response) => {
            if (response.data.confirmed) {
                onConfirm();
            } else {
                setConfirmingPassword(true);

                setTimeout(() => passwordRef.current?.focus(), 250);
            }
        });
    }

    function confirmPassword() {
        setForm({ ...form, processing: true });

        axios
            .post(route('password.confirm'), {
                password: form.password,
            })
            .then(() => {
                closeModal();
                setTimeout(() => onConfirm(), 250);
            })
            .catch((error: AxiosError<ValidationError>) => {
                if (error.response?.data?.errors?.password) {
                    setForm({
                        ...form,
                        processing: false,
                        error: error.response.data.errors.password[0],
                    });
                    passwordRef.current?.focus();
                }
            });
    }

    function closeModal() {
        setConfirmingPassword(false);
        setForm({ processing: false, password: '', error: '' });
    }

    return (
        <span>
            <span onClick={startConfirmingPassword}>{children}</span>

            <Dialog open={confirmingPassword} onOpenChange={setConfirmingPassword}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{content}</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <Input
                            ref={passwordRef}
                            type="password"
                            className="mt-1 block w-3/4"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.currentTarget.value })}
                        />

                        <InputError message={form.error} className="mt-2" />
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={closeModal}>
                            Cancel
                        </Button>

                        <Button
                            className={classNames('ml-2', { 'opacity-25': form.processing })}
                            onClick={confirmPassword}
                            disabled={form.processing}
                        >
                            {button}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </span>
    );
}
