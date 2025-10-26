<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Property;
use App\Repositories\Contracts\PropertyInterface;
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
        $property->update([
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
        ]);

        return $property;
    }

    public function getProperties(): Collection
    {
        return Property::get();
    }
}
