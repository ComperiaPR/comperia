<?php

declare(strict_types=1);

namespace App\Repositories;

use App\DTOs\PropertyCreateDTO;
use App\DTOs\PropertyUpdateDTO;
use App\Models\Property;
use App\Repositories\Contracts\PropertyInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class PropertyRepository implements PropertyInterface
{
    public function store(PropertyCreateDTO $propertyCreateDTO): Property
    {
        return Property::create([
            'name' => $propertyCreateDTO->name,
            'address' => $propertyCreateDTO->address,
            'description' => $propertyCreateDTO->description,
            'user_id' => Auth::user()->id,
        ]);
    }

    public function update(Property $property, PropertyUpdateDTO $propertyUpdateDTO): Property
    {
        $property->update([
            'name' => $propertyUpdateDTO->name,
            'address' => $propertyUpdateDTO->address,
            'description' => $propertyUpdateDTO->description,
            'user_id' => Auth::user()->id,
        ]);

        return $property;
    }

    public function getProperties(): Collection
    {
        return Property::get();
    }
}
