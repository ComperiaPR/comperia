import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomMultiSelect } from '@/components/CustomMultiSelect';
import { Search, X } from 'lucide-react';
import { PropertyFilterValues } from '@/types/property-filters';

interface FilterOption {
    id: number | string;
    name: string;
}

interface PropertyFiltersProps {
    filters: PropertyFilterValues;
    onChange: (filters: PropertyFilterValues) => void;
    onSearch: () => void;
    onClear: () => void;
    municipalities: FilterOption[];
    property_types: FilterOption[];
    transaction_types: FilterOption[];
    loading?: boolean;
}

// Shared filter bar used by Map Search, Basic Search and List Search so the
// three views expose exactly the same search fields.
export function PropertyFilters({
    filters,
    onChange,
    onSearch,
    onClear,
    municipalities,
    property_types,
    transaction_types,
    loading = false,
}: PropertyFiltersProps) {
    const set = <K extends keyof PropertyFilterValues>(key: K, value: PropertyFilterValues[K]) => {
        onChange({ ...filters, [key]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-5">
                <div className="space-y-1.5 lg:col-span-2">
                    <Label className="text-sm font-medium text-slate-900">Search</Label>
                    <Input
                        value={filters.q}
                        onChange={(e) => set('q', e.target.value)}
                        placeholder="Street, buyer, seller, track no, ID..."
                        className="w-full border-slate-200 bg-white"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-900">Municipality</Label>
                    <CustomMultiSelect
                        options={municipalities.map((m) => ({ label: m.name, value: String(m.id) }))}
                        value={filters.municipality_id}
                        onChange={(selected) => set('municipality_id', selected)}
                        placeholder="Select municipalities"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-900">Property Type</Label>
                    <CustomMultiSelect
                        options={property_types.map((t) => ({ label: t.name, value: String(t.id) }))}
                        value={filters.property_type_id}
                        onChange={(selected) => set('property_type_id', selected)}
                        placeholder="Select property types"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-900">Transaction Type</Label>
                    <CustomMultiSelect
                        options={transaction_types.map((t) => ({ label: t.name, value: String(t.id) }))}
                        value={filters.transaction_type_id}
                        onChange={(selected) => set('transaction_type_id', selected)}
                        placeholder="Select transaction types"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-900">Min Price</Label>
                    <Input
                        type="number"
                        value={filters.price_min}
                        onChange={(e) => set('price_min', e.target.value)}
                        placeholder="Min Price"
                        className="w-full border-slate-200 bg-white"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-900">Max Price</Label>
                    <Input
                        type="number"
                        value={filters.price_max}
                        onChange={(e) => set('price_max', e.target.value)}
                        placeholder="Max Price"
                        className="w-full border-slate-200 bg-white"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-900">Min Area (m²)</Label>
                    <Input
                        type="number"
                        value={filters.area_min}
                        onChange={(e) => set('area_min', e.target.value)}
                        placeholder="Min Area"
                        className="w-full border-slate-200 bg-white"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-900">Max Area (m²)</Label>
                    <Input
                        type="number"
                        value={filters.area_max}
                        onChange={(e) => set('area_max', e.target.value)}
                        placeholder="Max Area"
                        className="w-full border-slate-200 bg-white"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-900">Date From</Label>
                    <Input
                        type="date"
                        value={filters.date_from}
                        onChange={(e) => set('date_from', e.target.value)}
                        className="w-full border-slate-200 bg-white"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-900">Date To</Label>
                    <Input
                        type="date"
                        value={filters.date_to}
                        onChange={(e) => set('date_to', e.target.value)}
                        className="w-full border-slate-200 bg-white"
                    />
                </div>
            </div>

            <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="bg-primary text-white hover:bg-primary/90">
                    <Search className="mr-1 h-4 w-4" /> Search
                </Button>
                <Button type="button" variant="outline" onClick={onClear} disabled={loading}>
                    <X className="mr-1 h-4 w-4" /> Clear
                </Button>
            </div>
        </form>
    );
}
