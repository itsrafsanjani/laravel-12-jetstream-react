import { InertiaSharedProps } from '@/types';
import { usePage } from '@inertiajs/react';

export default function useTypedPage<T = Record<string, unknown>>() {
    return usePage<InertiaSharedProps<T>>();
}
