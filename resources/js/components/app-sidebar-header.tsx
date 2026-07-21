import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { MessageSquare } from 'lucide-react';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import ContactMessageModal from '@/components/contact-message-modal';
import { type BreadcrumbItem as BreadcrumbItemType, type SharedData } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { auth } = usePage<SharedData>().props;
    const [contactOpen, setContactOpen] = useState(false);

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 print:hidden">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <Button variant="outline" size="sm" onClick={() => setContactOpen(true)}>
                <MessageSquare className="mr-1 h-4 w-4" /> Contact Us
            </Button>

            <ContactMessageModal
                isOpen={contactOpen}
                onClose={() => setContactOpen(false)}
                defaultName={auth.user ? `${auth.user.first_name ?? ''} ${auth.user.last_name ?? ''}`.trim() : ''}
                defaultEmail={auth.user?.email ?? ''}
            />
        </header>
    );
}
