import Heading from '@/Components/Heading';
import AppLayout from '@/Layouts/AppLayout';
import APITokenManager from '@/Pages/API/Partials/APITokenManager';
import { ApiToken } from '@/types';
import { Head } from '@inertiajs/react';

interface Props {
    tokens: ApiToken[];
    availablePermissions: string[];
    defaultPermissions: string[];
}

export default function ApiTokenIndex({ tokens, availablePermissions, defaultPermissions }: Props) {
    return (
        <AppLayout>
            <Head title={'API Tokens'} />
            <Heading title={'API Tokens'} />

            <div>
                <div className="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
                    <APITokenManager tokens={tokens} availablePermissions={availablePermissions} defaultPermissions={defaultPermissions} />
                </div>
            </div>
        </AppLayout>
    );
}
