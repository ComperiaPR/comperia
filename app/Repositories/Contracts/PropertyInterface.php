<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\DTOs\PropertyCreateDTO;
use App\Models\Property;
use Illuminate\Support\Collection;

interface PropertyInterface
{
    public function store(PropertyCreateDTO $propertyCreateDTO): Property;
    public function getProperties(): Collection;
}
