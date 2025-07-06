import { useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import ActionMessage from '@/Components/ActionMessage';
import { Checkbox } from '@/Components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
} from '@/Components/ui/card';
import InputError from '@/Components/ui/InputError';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Separator } from '@/Components/ui/separator';
import { ApiToken } from '@/types';
import useTypedPage from '@/Hooks/useTypedPage';

interface Props {
    tokens: ApiToken[];
    availablePermissions: string[];
    defaultPermissions: string[];
}

export default function APITokenManager({
    tokens,
    availablePermissions,
    defaultPermissions,
}: Props) {
    const route = useRoute();
    const createApiTokenForm = useForm({
        name: '',
        permissions: defaultPermissions,
    });
    const updateApiTokenForm = useForm({
        permissions: [] as string[],
    });
    const deleteApiTokenForm = useForm({});
    const [displayingToken, setDisplayingToken] = useState(false);
    const [managingPermissionsFor, setManagingPermissionsFor] =
        useState<ApiToken | null>(null);
    const [apiTokenBeingDeleted, setApiTokenBeingDeleted] =
        useState<ApiToken | null>(null);
    const page = useTypedPage();

    function createApiToken() {
        createApiTokenForm.post(route('api-tokens.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setDisplayingToken(true);
                createApiTokenForm.reset();
            },
        });
    }

    function manageApiTokenPermissions(token: ApiToken) {
        updateApiTokenForm.setData('permissions', token.abilities);
        setManagingPermissionsFor(token);
    }

    function updateApiToken() {
        if (!managingPermissionsFor) {
            return;
        }
        updateApiTokenForm.put(
            route('api-tokens.update', [managingPermissionsFor]),
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setManagingPermissionsFor(null),
            },
        );
    }

    function confirmApiTokenDeletion(token: ApiToken) {
        setApiTokenBeingDeleted(token);
    }

    function deleteApiToken() {
        if (!apiTokenBeingDeleted) {
            return;
        }
        deleteApiTokenForm.delete(
            route('api-tokens.destroy', [apiTokenBeingDeleted]),
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setApiTokenBeingDeleted(null),
            },
        );
    }

    return (
        <div>
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Create API Token
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            API tokens allow third-party services to authenticate with our
                            application on your behalf.
                        </p>
                    </div>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            createApiToken();
                        }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-6 gap-6">
                                    {/* <!-- Token Name --> */}
                                    <div className="col-span-6 sm:col-span-4">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={createApiTokenForm.data.name}
                                            onChange={e =>
                                                createApiTokenForm.setData('name', e.currentTarget.value)
                                            }
                                            autoFocus
                                        />
                                        <InputError
                                            message={createApiTokenForm.errors.name}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* <!-- Token Permissions --> */}
                                    {availablePermissions.length > 0 && (
                                        <div className="col-span-6">
                                            <Label htmlFor="permissions">Permissions</Label>

                                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {availablePermissions.map(permission => (
                                                    <div key={permission}>
                                                        <label className="flex items-center">
                                                            <Checkbox
                                                                id={permission}
                                                                checked={createApiTokenForm.data.permissions.includes(
                                                                    permission,
                                                                )}
                                                                onCheckedChange={checked => {
                                                                    const currentPermissions =
                                                                        createApiTokenForm.data.permissions;
                                                                    const newPermissions = checked
                                                                        ? [...currentPermissions, permission]
                                                                        : currentPermissions.filter(p => p !== permission);
                                                                    createApiTokenForm.setData(
                                                                        'permissions',
                                                                        newPermissions,
                                                                    );
                                                                }}
                                                            />
                                                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                                                {permission}
                                                            </span>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="flex items-center justify-end text-right">
                                    <ActionMessage
                                        on={createApiTokenForm.recentlySuccessful}
                                        className="mr-3"
                                    >
                                        Created.
                                    </ActionMessage>

                                    <Button
                                        className={classNames({
                                            'opacity-25': createApiTokenForm.processing,
                                        })}
                                        disabled={createApiTokenForm.processing}
                                    >
                                        Create
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>

            {tokens.length > 0 ? (
                <div>
                    <div className="hidden sm:block">
                        <div className="py-8">
                            <Separator />
                        </div>
                    </div>

                    <div className="mt-10 sm:mt-0 md:grid md:grid-cols-3 md:gap-6">
                        <div className="md:col-span-1">
                            <div className="px-4 sm:px-0">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Manage API Tokens
                                </h3>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    You may delete any of your existing tokens if they are no
                                    longer needed.
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 md:mt-0 md:col-span-2">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        {tokens.map(token => (
                                            <div
                                                className="flex items-center justify-between"
                                                key={token.id}
                                            >
                                                <div className="break-all dark:text-white">
                                                    {token.name}
                                                </div>

                                                <div className="flex items-center">
                                                    {token.last_used_ago && (
                                                        <div className="text-sm text-gray-400">
                                                            Last used {token.last_used_ago}
                                                        </div>
                                                    )}

                                                    {availablePermissions.length > 0 ? (
                                                        <Button
                                                            variant="link"
                                                            className="cursor-pointer ml-6 text-sm text-gray-400"
                                                            onClick={() => manageApiTokenPermissions(token)}
                                                        >
                                                            Permissions
                                                        </Button>
                                                    ) : null}

                                                    <Button
                                                        variant="link"
                                                        className="cursor-pointer ml-6 text-sm text-red-500"
                                                        onClick={() => confirmApiTokenDeletion(token)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* <!-- Token Value Modal --> */}
            <Dialog open={displayingToken} onOpenChange={setDisplayingToken}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>API Token</DialogTitle>
                        <DialogDescription>
                            Please copy your new API token. For your security, it won't be
                            shown again.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded font-mono text-sm text-gray-500">
                        {page.props?.jetstream?.flash?.token}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setDisplayingToken(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* <!-- API Token Permissions Modal --> */}
            <Dialog
                open={!!managingPermissionsFor}
                onOpenChange={open => !open && setManagingPermissionsFor(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>API Token Permissions</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availablePermissions.map(permission => (
                            <div key={permission}>
                                <label className="flex items-center">
                                    <Checkbox
                                        id={permission}
                                        checked={updateApiTokenForm.data.permissions.includes(
                                            permission,
                                        )}
                                        onCheckedChange={checked => {
                                            const currentPermissions =
                                                updateApiTokenForm.data.permissions;
                                            const newPermissions = checked
                                                ? [...currentPermissions, permission]
                                                : currentPermissions.filter(p => p !== permission);
                                            updateApiTokenForm.setData('permissions', newPermissions);
                                        }}
                                    />
                                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                        {permission}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setManagingPermissionsFor(null)}
                        >
                            Cancel
                        </Button>

                        <Button
                            className="ml-2"
                            onClick={updateApiToken}
                            disabled={updateApiTokenForm.processing}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* <!-- Delete Token Confirmation Modal --> */}
            <Dialog
                open={!!apiTokenBeingDeleted}
                onOpenChange={open => !open && setApiTokenBeingDeleted(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete API Token</DialogTitle>
                        <DialogDescription>
                            Are you sure you would like to delete this API token?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setApiTokenBeingDeleted(null)}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="destructive"
                            className="ml-2"
                            onClick={deleteApiToken}
                            disabled={deleteApiTokenForm.processing}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
