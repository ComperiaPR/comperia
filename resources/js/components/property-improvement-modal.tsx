import { FormEventHandler, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SelectElement from '@/components/ui/select-element';
import InputError from '@/components/input-error';

interface PropertyImprovementModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: number;
    improvementTypes: Record<string, string>;
}

// "Please Improve Me" form, shown from a property's detail view. Submissions
// are stored in the same contact_messages table as the general contact form,
// tagged with type=improvement so they show up together in Admin/Contact.
export default function PropertyImprovementModal({ isOpen, onClose, propertyId, improvementTypes }: PropertyImprovementModalProps) {
    const firstType = Object.keys(improvementTypes)[0] ?? '';

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        improvement_type: firstType,
        message: '',
    });

    useEffect(() => {
        if (isOpen) {
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

        post(`/properties/${propertyId}/improvements`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Suggestion sent', {
                    description: 'Thanks! Your suggestion has been sent.',
                });
                handleClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Please Improve Me</DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="improvement-type">Type of Improvment</Label>
                        <SelectElement
                            data={Object.entries(improvementTypes).map(([value, label]) => ({ id: value, name: label }))}
                            valueSelected={data.improvement_type}
                            onChangeEvent={(newValue) => setData('improvement_type', newValue.toString())}
                            className="w-full border-slate-200 bg-white"
                        />
                        <InputError message={errors.improvement_type} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="improvement-property">Property No.</Label>
                        <Input id="improvement-property" value={propertyId} disabled readOnly />
                    </div>

                    <div>
                        <Label htmlFor="improvement-message">Message Data</Label>
                        <Textarea
                            id="improvement-message"
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
