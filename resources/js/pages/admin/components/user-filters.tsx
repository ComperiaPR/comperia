import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MultiSelect from '@/components/ui/multiselect';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FiltersProps {
    roles: Record<string, string>;
    initialFilters: {
        search?: string;
        roles?: string[];
        statuses?: string[];
    };
    onFiltersChange: (filters: any) => void;
    loading?: boolean;
}

export default function UserFilters({ 
    roles, 
    initialFilters, 
    onFiltersChange, 
    loading = false 
}: FiltersProps) {
    // Helper para convertir valores del backend a arrays para el frontend
    const convertBackendToFrontend = (filters: any) => ({
        search: filters.search || '',
        roles: filters.roles || [],
        statuses: filters.statuses || [],
        batches: filters.batches || [],
    });

    const [filters, setFilters] = useState(convertBackendToFrontend(initialFilters));

    const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');

    // Debounce para la búsqueda de texto
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchTerm !== filters.search) {
                const newFilters = { ...filters, search: searchTerm };
                setFilters(newFilters);
                onFiltersChange(newFilters);
            }
        }, 1500);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const handleRoleChange = useCallback((selectedRoles: number[]) => {
        // Convertir IDs numéricos a strings de roles
        const roleStrings = selectedRoles.map(id => {
            const roleEntry = Object.entries(roles).find(([, label], index) => index === id);
            return roleEntry ? roleEntry[0] : '';
        }).filter(Boolean);
        
        const newFilters = { ...filters, roles: roleStrings };
        setFilters(newFilters);
        onFiltersChange(newFilters);
    }, [filters, roles, onFiltersChange]);

    const handleStatusChange = useCallback((selectedStatuses: number[]) => {
        const statusValues = ['active', 'inactive', 'verified', 'unverified'];
        const statusStrings = selectedStatuses.map(id => statusValues[id]).filter(Boolean);
        
        const newFilters = { ...filters, statuses: statusStrings };
        setFilters(newFilters);
        onFiltersChange(newFilters);
    }, [filters, onFiltersChange]);

    const handleBatchChange = useCallback((selectedBatches: number[]) => {
        const newFilters = { ...filters, batches: selectedBatches };
        setFilters(newFilters);
        onFiltersChange(newFilters);
    }, [filters, onFiltersChange]);

    const clearFilters = useCallback(() => {
        const emptyFilters = {
            search: '',
            roles: [],
            statuses: [],
            batches: [],
        };
        setFilters(emptyFilters);
        setSearchTerm('');
        onFiltersChange(emptyFilters);
    }, [onFiltersChange]);

    const hasActiveFilters = filters.search !== '' || filters.roles.length > 0 || filters.statuses.length > 0 || filters.batches.length > 0;

    // Preparar opciones para multiselects
    const roleOptions = Object.entries(roles).map(([value, label], index) => ({ 
        id: index, 
        name: label 
    }));

    const statusOptions = [
        { id: 0, name: 'Activos' },
        { id: 1, name: 'Inactivos' },
        { id: 2, name: 'Email verificado' },
        { id: 3, name: 'Email sin verificar' },
    ];

    // Convertir valores seleccionados a IDs para los multiselects
    const selectedRoleIds = filters.roles.map(roleValue => {
        const index = Object.keys(roles).indexOf(roleValue);
        return index >= 0 ? index : -1;
    }).filter(id => id >= 0);

    const selectedStatusIds = filters.statuses.map(statusValue => {
        const statusValues = ['active', 'inactive', 'verified', 'unverified'];
        return statusValues.indexOf(statusValue);
    }).filter(id => id >= 0);

    return (
        <Card className="mb-6">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Filtros</CardTitle>
                        <CardDescription>
                            Filtra los usuarios por diferentes criterios
                        </CardDescription>
                    </div>
                    {hasActiveFilters && (
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={clearFilters}
                            disabled={loading}
                        >
                            Limpiar filtros
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Búsqueda por texto */}
                    <div className="space-y-2">
                        <Label htmlFor="search">Buscar por palabra clave</Label>
                        <Input
                            id="search"
                            type="text"
                            placeholder="Nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={loading}
                            className="w-full"
                        />
                        {searchTerm !== filters.search && searchTerm !== '' && (
                            <div className="text-xs text-gray-500">
                                Buscando...
                            </div>
                        )}
                    </div>

                    {/* Filtro por rol */}
                    <div className="space-y-2">
                        <Label htmlFor="roles">Roles</Label>
                        <MultiSelect
                            label=""
                            options={roleOptions}
                            values={selectedRoleIds}
                            onChange={handleRoleChange}
                            placeholder="Seleccionar roles..."
                            disabled={loading}
                            maxTagsVisible={2}
                        />
                    </div>

                    {/* Filtro por estado */}
                    <div className="space-y-2">
                        <Label htmlFor="statuses">Estados</Label>
                        <MultiSelect
                            label=""
                            options={statusOptions}
                            values={selectedStatusIds}
                            onChange={handleStatusChange}
                            placeholder="Seleccionar estados..."
                            disabled={loading}
                            maxTagsVisible={2}
                        />
                    </div>
                </div>

                {/* Indicador de filtros activos */}
                {hasActiveFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>Filtros activos:</span>
                            {filters.search && (
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                                    Búsqueda: "{filters.search}"
                                </span>
                            )}
                            {filters.roles.length > 0 && (
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                                    Roles: {filters.roles.map((roleValue: string) => roles[roleValue]).join(', ')}
                                </span>
                            )}
                            {filters.statuses.length > 0 && (
                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs">
                                    Estados: {filters.statuses.map((statusValue: string) => {
                                        const statusLabels = { 
                                            'active': 'Activos', 
                                            'inactive': 'Inactivos', 
                                            'verified': 'Email verificado', 
                                            'unverified': 'Email sin verificar' 
                                        };
                                        return statusLabels[statusValue as keyof typeof statusLabels];
                                    }).join(', ')}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}