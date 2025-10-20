<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Property;
use App\Repositories\Contracts\PropertyMapInterface;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
// use Illuminate\Support\Facades\Request;

class PropertyMapService
{
    private PropertyMapInterface $propertyRepository;

    public function __construct(PropertyMapInterface $propertyRepository)
    {
        $this->propertyRepository = $propertyRepository;
    }

    public function inBounds(array $bounds)
    {
        return $this->propertyRepository->inBounds($bounds);
    }

    public function lastUpdate(int $limit)
    {
        return $this->propertyRepository->lastUpdate($limit);
    }

    public function clearCache(): void
    {
        $this->propertyRepository->clearCache();
    }

    public function search(array $query): LengthAwarePaginator
    {
        return $this->propertyRepository->search($query);
    }
}
