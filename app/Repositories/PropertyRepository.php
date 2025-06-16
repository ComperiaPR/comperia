<?php

declare(strict_types=1);

namespace App\Repositories;

use App\DTOs\PropertyCreateDTO;
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

    public function getProperties(): Collection
    {
        return Property::where('user_id', Auth::user()->id)->get();
    }
}
