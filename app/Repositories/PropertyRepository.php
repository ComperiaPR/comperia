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
        ]);

        return $property;
    }

    public function getProperties(): Collection
    {
        return Property::get();
    }
}
