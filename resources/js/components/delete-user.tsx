import { Button } from '@/components/ui/button';
import HeadingSmall from '@/components/heading-small';

// Account deletion is disabled: users must contact support instead of
// self-deleting, since the destroy endpoint is now blocked server-side too.
export default function DeleteUser() {
    return (
        <div className="space-y-6">
            <HeadingSmall title="Delete account" description="Delete your account and all of its resources" />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">Warning</p>
                    <p className="text-sm">
                        Account deletion is currently disabled. Please contact support if you need to delete your account.
                    </p>
                </div>

                <Button variant="destructive" disabled>
                    Delete account
                </Button>
            </div>
        </div>
    );
}
