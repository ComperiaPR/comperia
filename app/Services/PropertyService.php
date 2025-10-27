<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Property;
use App\Repositories\Contracts\PropertyInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
// use Illuminate\Support\Facades\Request;

class PropertyService
{
    private PropertyInterface $propertyRepository;

    public function __construct(PropertyInterface $propertyRepository)
    {
        $this->propertyRepository = $propertyRepository;
    }

    public function store(Request $propertyRequest): Property
    {
        return $this->propertyRepository->store($propertyRequest);
    }

    public function update(Property $property, Request $propertyUpdateDTO): Property
    {
        return $this->propertyRepository->update($property, $propertyUpdateDTO);
    }

    public function getProperties(): LengthAwarePaginator
    {
        return $this->propertyRepository->getProperties();
    }
}
