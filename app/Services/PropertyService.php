<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\PropertyCreateDTO;
use App\DTOs\PropertyUpdateDTO;
use App\Models\Property;
use App\Repositories\Contracts\PropertyInterface;
use Illuminate\Support\Collection;

class PropertyService
{
    public function __construct(
        private PropertyInterface $propertyRepository
    ) {
    }

    public function store(PropertyCreateDTO $propertyCreateDTO): Property
    {
        return $this->propertyRepository->store($propertyCreateDTO);
    }

    public function update(Property $property, PropertyUpdateDTO $propertyUpdateDTO): Property
    {
        return $this->propertyRepository->update($property, $propertyUpdateDTO);
    }

    public function getProperties(): Collection
    {
        return $this->propertyRepository->getProperties();
    }
}
