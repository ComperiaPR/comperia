<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\Contracts\PropertyMapInterface;

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

    public function getMaxUpdatedAt(): ?string
    {
        return $this->propertyRepository->getMaxUpdatedAt();
    }

    public function getFilters(): array
    {
        return $this->propertyRepository->getFilters();
    }

    public function getAllLocations(int $limit = 10000): array
    {
        return $this->propertyRepository->getAllLocations($limit);
    }

    public function lastUpdate(int $limit)
    {
        return $this->propertyRepository->lastUpdate($limit);
    }

    public function clearCache(): void
    {
        $this->propertyRepository->clearCache();
    }

    public function search(array $query): array
    {
        return $this->propertyRepository->search($query);
    }
}
