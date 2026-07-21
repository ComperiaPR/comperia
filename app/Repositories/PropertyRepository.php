<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Property;
use App\Repositories\Contracts\PropertyInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
// use Illuminate\Support\Facades\Request;

class PropertyRepository implements PropertyInterface
{
    public function store(Request $propertyRequest): Property
    {
        return Property::create([
            'daily' => $propertyRequest->daily,
            'page_entry' => $propertyRequest->page_entry,
            'track_no' => $propertyRequest->track_no,
            'municipality_id' => $propertyRequest->municipality_id,
            'property_status_id' => $propertyRequest->property_status_id,
            'registry' => $propertyRequest->registry,
            'deed_no' => $propertyRequest->deed_no,
            'deed_pdf_path' => $propertyRequest->deed_pdf_path,
            'sale_date' => $propertyRequest->sale_date,
            'transaction_type_id' => $propertyRequest->transaction_type_id,
            'notary' => $propertyRequest->notary,
            'seller' => $propertyRequest->seller,
            'resident_seller' => $propertyRequest->resident_seller,
            'buyer' => $propertyRequest->buyer,
            'resident_buyer' => $propertyRequest->resident_buyer,
            'development' => $propertyRequest->development,
            'street' => $propertyRequest->street,
            'unit_number' => $propertyRequest->unit_number,
            'ward' => $propertyRequest->ward,
            'sector' => $propertyRequest->sector,
            'road_kilometer' => $propertyRequest->road_kilometer,
            'zip_code' => $propertyRequest->zip_code,
            'cadastre' => $propertyRequest->cadastre,
            'property_type_id' => $propertyRequest->property_type_id,
            'folio_page' => $propertyRequest->folio_page,
            'volumen' => $propertyRequest->volumen,
            'inscription' => $propertyRequest->inscription,
            'source' => $propertyRequest->source,
            'remarks' => $propertyRequest->remarks,
            'mortgagee_id' => $propertyRequest->mortgagee_id,
            'mortgagee_amount' => $propertyRequest->mortgagee_amount,
            'interest_rate' => $propertyRequest->interest_rate,
            'public_web' => $propertyRequest->public_web,
            'latitude' => $propertyRequest->latitude,
            'longitude' => $propertyRequest->longitude,
            'area_sqr_meter' => $propertyRequest->area_sqr_meter,
            'area_sqr_feet' => $propertyRequest->area_sqr_feet,
            'area_cuerdas' => $propertyRequest->area_cuerdas,
            'price' => $propertyRequest->price,
            'price_sqr_meter' => $propertyRequest->price_sqr_meter,
            'price_sqr_feet' => $propertyRequest->price_sqr_feet,
            'price_cuerdas' => $propertyRequest->price_cuerdas,
            'gla_sf' => $propertyRequest->gla_sf,
            'gba_sf' => $propertyRequest->gba_sf,
            'zoning' => $propertyRequest->zoning,
            'flood_zone' => $propertyRequest->flood_zone,
            'past_current_use' => $propertyRequest->past_current_use,
            'property_condition_id' => $propertyRequest->property_condition_id,
        ]);
    }

    public function update(Property $property, Request $propertyRequest): Property
    {
        $data = [
            'daily' => $propertyRequest->daily,
            'page_entry' => $propertyRequest->page_entry,
            'track_no' => $propertyRequest->track_no,
            'municipality_id' => $propertyRequest->municipality_id,
            'property_status_id' => $propertyRequest->property_status_id,
            'registry' => $propertyRequest->registry,
            'deed_no' => $propertyRequest->deed_no,
            'sale_date' => $propertyRequest->sale_date,
            'transaction_type_id' => $propertyRequest->transaction_type_id,
            'notary' => $propertyRequest->notary,
            'seller' => $propertyRequest->seller,
            'resident_seller' => $propertyRequest->resident_seller,
            'buyer' => $propertyRequest->buyer,
            'resident_buyer' => $propertyRequest->resident_buyer,
            'development' => $propertyRequest->development,
            'street' => $propertyRequest->street,
            'unit_number' => $propertyRequest->unit_number,
            'ward' => $propertyRequest->ward,
            'sector' => $propertyRequest->sector,
            'road_kilometer' => $propertyRequest->road_kilometer,
            'zip_code' => $propertyRequest->zip_code,
            'cadastre' => $propertyRequest->cadastre,
            'property_type_id' => $propertyRequest->property_type_id, 
            'folio_page' => $propertyRequest->folio_page,
            'volumen' => $propertyRequest->volumen,
            'inscription' => $propertyRequest->inscription,
            'source' => $propertyRequest->source,
            'remarks' => $propertyRequest->remarks,
            'mortgagee_id' => $propertyRequest->mortgagee_id,   
            'mortgagee_amount' => $propertyRequest->mortgagee_amount,
            'interest_rate' => $propertyRequest->interest_rate,
            'public_web' => $propertyRequest->public_web,
            'latitude' => $propertyRequest->latitude,
            'longitude' => $propertyRequest->longitude,
            'area_sqr_meter' => $propertyRequest->area_sqr_meter,
            'area_sqr_feet' => $propertyRequest->area_sqr_feet,
            'area_cuerdas' => $propertyRequest->area_cuerdas,
            'price' => $propertyRequest->price,
            'price_sqr_meter' => $propertyRequest->price_sqr_meter,
            'price_sqr_feet' => $propertyRequest->price_sqr_feet,
            'price_cuerdas' => $propertyRequest->price_cuerdas, 
            'gla_sf' => $propertyRequest->gla_sf,
            'gba_sf' => $propertyRequest->gba_sf,
            'zoning' => $propertyRequest->zoning,
            'flood_zone' => $propertyRequest->flood_zone,
            'past_current_use' => $propertyRequest->past_current_use,
            'property_condition_id' => $propertyRequest->property_condition_id,
        ];

        if ($propertyRequest->filled('deed_pdf_path')) {
            $data['deed_pdf_path'] = $propertyRequest->deed_pdf_path;
        }

        $property->update($data);

        return $property;
    }
    /**
     * Admin property listing (all properties, no public_web restriction)
     * with the same search filters used by the client-facing views.
     */
    public function getProperties(Request $propertyRequest): LengthAwarePaginator
    {
        $query = Property::query()
            ->with(['municipality', 'property_type', 'property_status', 'transaction_type']);

        $this->applyFilters($query, $propertyRequest);
        $this->applySort($query, $propertyRequest);

        $perPage = (int) $propertyRequest->input('per_page', 10);

        return $query->paginate($perPage)->onEachSide(0);
    }

    public function getClientProperties(Request $propertyRequest): LengthAwarePaginator
    {
        $query = Property::where('public_web', true)
            ->with(['municipality', 'property_type', 'property_status', 'transaction_type', 'mortgagee']);

        $this->applyFilters($query, $propertyRequest);
        $this->applySort($query, $propertyRequest);

        $perPage = (int) $propertyRequest->input('per_page', 100);

        return $query->paginate($perPage)->onEachSide(0);
    }

    /**
     * Search filters shared by every property listing (admin, list search,
     * basic search) so they all behave the same way.
     */
    private function applyFilters(Builder $query, Request $propertyRequest): void
    {
        if ($search = $propertyRequest->input('q')) {
            $query->where(function ($sub) use ($search) {
                $sub->where('street', 'like', "%{$search}%")
                    ->orWhere('development', 'like', "%{$search}%")
                    ->orWhere('buyer', 'like', "%{$search}%")
                    ->orWhere('seller', 'like', "%{$search}%")
                    ->orWhere('track_no', 'like', "%{$search}%")
                    ->orWhere('cadastre', 'like', "%{$search}%")
                    ->orWhere('id', 'like', "%{$search}%");
            });
        }

        if ($municipalityIds = $this->normalizeIds($propertyRequest->input('municipality_id'))) {
            $query->whereIn('municipality_id', $municipalityIds);
        }

        if ($propertyTypeIds = $this->normalizeIds($propertyRequest->input('property_type_id'))) {
            $query->whereIn('property_type_id', $propertyTypeIds);
        }

        if ($transactionTypeIds = $this->normalizeIds($propertyRequest->input('transaction_type_id'))) {
            $query->whereIn('transaction_type_id', $transactionTypeIds);
        }

        if ($priceMin = $propertyRequest->input('price_min')) {
            $query->where('price', '>=', (float) $priceMin);
        }

        if ($priceMax = $propertyRequest->input('price_max')) {
            $query->where('price', '<=', (float) $priceMax);
        }

        if ($areaMin = $propertyRequest->input('area_min')) {
            $query->where('area_sqr_meter', '>=', (float) $areaMin);
        }

        if ($areaMax = $propertyRequest->input('area_max')) {
            $query->where('area_sqr_meter', '<=', (float) $areaMax);
        }

        if ($dateFrom = $propertyRequest->input('date_from')) {
            $query->whereDate('sale_date', '>=', $dateFrom);
        }

        if ($dateTo = $propertyRequest->input('date_to')) {
            $query->whereDate('sale_date', '<=', $dateTo);
        }
    }

    private function applySort(Builder $query, Request $propertyRequest): void
    {
        $sort = $propertyRequest->input('sort');
        $direction = $propertyRequest->input('direction', 'asc');

        // Validar campos permitidos para evitar SQL Injection
        $allowedSorts = [
            'id', 'municipality_id', 'property_type_id', 'property_status_id', 'transaction_type_id',
            'sale_date', 'price', 'buyer', 'daily', 'page_entry', 'track_no', 'folio_page', 'volumen', 'inscription', 'cadastre'
        ];

        if ($sort && in_array($sort, $allowedSorts)) {
            $query->orderBy($sort, $direction === 'desc' ? 'desc' : 'asc');

            return;
        }

        $query->orderBy('id');
    }

    private function normalizeIds($param): array
    {
        if (is_array($param)) {
            return array_values(array_filter(array_map('intval', $param)));
        }

        if (is_string($param) && $param !== '') {
            if (str_contains($param, ',')) {
                return array_values(array_filter(array_map('intval', explode(',', $param))));
            }

            return [(int) $param];
        }

        if (is_numeric($param)) {
            return [(int) $param];
        }

        return [];
    }
}
