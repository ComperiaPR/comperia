import { FormEventHandler, useCallback, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import SelectElement from '@/components/ui/select-element';


interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId?: number | null;
}

export default function HistoryModal({ isOpen, onClose, propertyId }: UserModalProps) {
    const isEditing = !!propertyId;

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<{
        name: string;
        email: string;
        password: string;
        role: string;
        batches: number[];
    }>({
        name: '',
        email: '',
        password: '',
        role: '',
        batches: [],
    });

    // Pre-llenar el formulario cuando editamos un usuario
    useEffect(() => {
        // if (isEditing && user) {
        //     setData({
        //         name: user.name,
        //         email: user.email,
        //         password: '', // No mostrar contraseña existente
        //         role: user.roles[0]?.name || '',
        //         batches: user.batches.map(batch => batch.id),
        //     });
        // } else {
        //     reset();
        // }
        clearErrors();
    }, [propertyId, isEditing, isOpen]);

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const submitData: any = { ...data };
        
        // Si estamos editando y no se cambió la contraseña, no la enviamos
        if (isEditing && !data.password) {
            delete submitData.password;
        }

        const options = {
            onSuccess: () => {
                handleClose();
            },
            onError: () => {
                // Los errores se manejan automáticamente por Inertia
            }
        };

        if (isEditing) {
            put(route('admin.users.update', propertyId), options);
        } else {
            post(route('admin.users.store'), options);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] lg:max-w-[1200px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Editar Usuario' : 'Crear Usuario'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing 
                            ? 'Modifica los datos del usuario. Los campos vacíos mantendrán su valor actual.'
                            : 'Complete el formulario para crear un nuevo usuario.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
                        <div>
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Nombre del usuario"
                                required
                                disabled={processing}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Correo electrónico"
                                required
                                disabled={processing}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="password">
                                {isEditing ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder={isEditing ? "Dejar vacío para mantener actual" : "Contraseña"}
                                required={!isEditing}
                                disabled={processing}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Usuario')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}