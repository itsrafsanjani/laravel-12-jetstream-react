import React, { useState } from 'react';
import useTypedPage from '@/Hooks/useTypedPage';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

export function Banner() {
    const [show, setShow] = useState(true);
    const { props } = useTypedPage();
    const style = props.jetstream.flash?.bannerStyle || 'success';
    const message = props.jetstream.flash?.banner || '';

    return (
        <div>
            {show && message ? (
                <div
                    className={cn('w-full border-b', {
                        'bg-primary text-primary-foreground border-border/40': style === 'success',
                        'bg-destructive text-destructive-foreground border-border/40': style === 'danger',
                    })}
                >
                    <div className="mx-auto md:max-w-7xl px-4 py-2">
                        <div className="flex items-center justify-between flex-wrap">
                            <div className="w-0 flex-1 flex items-center min-w-0">
                                <span
                                    className={cn('flex p-2 rounded-lg', {
                                        'bg-white/20': style === 'success' || style === 'danger',
                                    })}
                                >
                                    {(() => {
                                        switch (style) {
                                            case 'success':
                                                return (
                                                    <svg
                                                        className="h-5 w-5 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                );
                                            case 'danger':
                                                return (
                                                    <svg
                                                        className="h-5 w-5 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                        />
                                                    </svg>
                                                );
                                            default:
                                                return null;
                                        }
                                    })()}
                                </span>

                                <p className="ml-3 font-medium text-sm text-white truncate">
                                    {message as string}
                                </p>
                            </div>

                            <div className="flex-shrink-0 sm:ml-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="-mr-1 sm:-mr-2 text-current hover:bg-white/20"
                                    aria-label="Dismiss"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShow(false);
                                    }}
                                >
                                    <svg
                                        className="h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
