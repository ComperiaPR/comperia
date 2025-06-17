<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\DTOs\PropertyCreateDTO;
use App\DTOs\PropertyUpdateDTO;
use App\Models\Property;
use Illuminate\Support\Collection;

interface PropertyInterface
{
    public function store(PropertyCreateDTO $propertyCreateDTO): Property;
    public function update(Property $property, PropertyUpdateDTO $propertyUpdateDTO): Property;
    public function getProperties(): Collection;
}
