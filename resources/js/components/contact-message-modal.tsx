import { FormEventHandler, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';

interface ContactMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultName?: string;
    defaultEmail?: string;
}

// Shared "Send Us a Message" form, used both from the public landing page and
// from every authenticated page (see AppSidebarHeader).
export default function ContactMessageModal({ isOpen, onClose, defaultName = '', defaultEmail = '' }: ContactMessageModalProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: defaultName,
        email: defaultEmail,
        subject: '',
        message: '',
    });

    useEffect(() => {
        if (isOpen) {
            setData((prev) => ({
                ...prev,
                name: prev.name || defaultName,
                email: prev.email || defaultEmail,
            }));
            clearErrors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('contact-messages.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Message sent', {
                    description: 'Thanks for reaching out, we will get back to you soon.',
                });
                handleClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Send Us a Message</DialogTitle>
                    <DialogDescription>Fill out the form below and our team will get back to you shortly.</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="contact-name">*Name</Label>
                        <Input
                            id="contact-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            required
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="contact-email">*Email</Label>
                        <Input
                            id="contact-email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            required
                        />
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="contact-subject">Subject</Label>
                        <Input
                            id="contact-subject"
                            value={data.subject}
                            onChange={(e) => setData('subject', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.subject} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="contact-message">*Message</Label>
                        <Textarea
                            id="contact-message"
                            rows={6}
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            disabled={processing}
                            required
                        />
                        <InputError message={errors.message} className="mt-1" />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Sending...' : 'Send'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
