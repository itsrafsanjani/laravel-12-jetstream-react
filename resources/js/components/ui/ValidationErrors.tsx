import { usePage } from '@inertiajs/react';
import React from 'react';

interface Props {
    className?: string;
}

export default function ValidationErrors({ className }: Props) {
    const { errors } = usePage().props;
    const hasErrors = Object.keys(errors).length > 0;

    if (!hasErrors) {
        return null;
    }

    return (
        <div className={className}>
            <div className="font-medium text-red-600 dark:text-red-400">
                Whoops! Something went wrong.
            </div>

            <ul className="mt-3 list-disc list-inside text-sm text-red-600 dark:text-red-400">
                {Object.keys(errors).map((key, index) => (
                    <li key={index}>{errors[key]}</li>
                ))}
            </ul>
        </div>
    );
}
