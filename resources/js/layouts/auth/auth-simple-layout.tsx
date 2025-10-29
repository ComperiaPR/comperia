import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
    type?: string;
}

export default function AuthSimpleLayout({ children, title, description, type }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-transparent p-6 md:p-10">
            <div
                className={
                    "w-full bg-background p-8 rounded-lg shadow-lg border border-border " +
                    (type === 'register'
                        ? "xl:max-w-3/4 lg:max-w-9/10 md:max-w-9/10"
                        : "max-w-md")
                }
            >
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        {/* <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                                <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link> */}

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
                <Toaster position="top-center" richColors toastOptions={{ style: { fontSize: "0.8rem" } }} />
            </div>
        </div>
    );
}
