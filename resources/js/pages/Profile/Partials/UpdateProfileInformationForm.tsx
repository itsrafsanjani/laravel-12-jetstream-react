import { Link, router, useForm } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import InputError from '@/Components/ui/InputError';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
} from '@/Components/ui/card';
import { User } from '@/types';
import useTypedPage from '@/Hooks/useTypedPage';
import Heading from '@/Components/Heading';
import { cn } from '@/lib/utils';

interface Props {
    user: User;
}

export default function UpdateProfileInformationForm({ user }: Props) {
    const form = useForm({
        _method: 'PUT',
        name: user.name,
        email: user.email,
        photo: null as File | null,
    });
    const route = useRoute();
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const photoRef = useRef<HTMLInputElement>(null);
    const page = useTypedPage();
    const [verificationLinkSent, setVerificationLinkSent] = useState(false);

    function updateProfileInformation() {
        form.post(route('user-profile-information.update'), {
            errorBag: 'updateProfileInformation',
            preserveScroll: true,
            onSuccess: () => clearPhotoFileInput(),
        });
    }

    function selectNewPhoto() {
        photoRef.current?.click();
    }

    function updatePhotoPreview() {
        const photo = photoRef.current?.files?.[0];

        if (!photo) {
            return;
        }

        form.setData('photo', photo);

        const reader = new FileReader();

        reader.onload = e => {
            setPhotoPreview(e.target?.result as string);
        };

        reader.readAsDataURL(photo);
    }

    function deletePhoto() {
        router.delete(route('current-user-photo.destroy'), {
            preserveScroll: true,
            onSuccess: () => {
                setPhotoPreview(null);
                clearPhotoFileInput();
            },
        });
    }

    function clearPhotoFileInput() {
        if (photoRef.current?.value) {
            photoRef.current.value = '';
            form.setData('photo', null);
        }
    }

    return (
        <div>
            <Heading
                title="Profile Information"
                description="Update your account's profile information and email address."
            />
            <form
                onSubmit={e => {
                    e.preventDefault();
                    updateProfileInformation();
                }}
            >
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {/* <!-- Profile Photo --> */}
                            {page.props.jetstream.managesProfilePhotos ? (
                                <div className="space-y-2">
                                    {/* <!-- Profile Photo File Input --> */}
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={photoRef}
                                        onChange={updatePhotoPreview}
                                    />

                                    <Label htmlFor="photo">Photo</Label>

                                    {photoPreview ? (
                                        // <!-- New Profile Photo Preview -->
                                        <div className="mt-2">
                                            <span
                                                className="block rounded-full w-20 h-20"
                                                style={{
                                                    backgroundSize: 'cover',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'center center',
                                                    backgroundImage: `url('${photoPreview}')`,
                                                }}
                                            ></span>
                                        </div>
                                    ) : (
                                        // <!-- Current Profile Photo -->
                                        <div className="mt-2">
                                            <img
                                                src={user.profile_photo_url}
                                                alt={user.name}
                                                className="rounded-full h-20 w-20 object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="secondary"
                                            type="button"
                                            onClick={selectNewPhoto}
                                        >
                                            Select A New Photo
                                        </Button>

                                        {user.profile_photo_path ? (
                                            <Button
                                                variant="secondary"
                                                type="button"
                                                onClick={deletePhoto}
                                            >
                                                Remove Photo
                                            </Button>
                                        ) : null}
                                    </div>

                                    <InputError message={form.errors.photo} className="mt-2" />
                                </div>
                            ) : null}

                            {/* <!-- Name --> */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    className="w-full"
                                    value={form.data.name}
                                    onChange={e => form.setData('name', e.currentTarget.value)}
                                    autoComplete="name"
                                />
                                <InputError message={form.errors.name} className="mt-2" />
                            </div>

                            {/* <!-- Email --> */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    className="w-full"
                                    value={form.data.email}
                                    onChange={e => form.setData('email', e.currentTarget.value)}
                                />
                                <InputError message={form.errors.email} className="mt-2" />

                                {page.props.jetstream.hasEmailVerification &&
                                    user.email_verified_at === null ? (
                                    <div>
                                        <p className="text-sm mt-2">
                                            Your email address is unverified.
                                            <Link
                                                href={route('verification.send')}
                                                method="post"
                                                as="button"
                                                className="underline"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setVerificationLinkSent(true);
                                                }}
                                            >
                                                Click here to re-send the verification email.
                                            </Link>
                                        </p>
                                        {verificationLinkSent && (
                                            <div className="mt-2 font-medium text-sm text-green-600">
                                                A new verification link has been sent to your email address.
                                            </div>
                                        )}
                                    </div>
                                ) : null}
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
