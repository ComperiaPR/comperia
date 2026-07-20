<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

interface PropertyMapInterface
{
    public function inBounds(array $bounds);
    public function getMaxUpdatedAt(): ?string;
    public function lastUpdate(int $limit);
    public function getFilters(): array;
    public function getAllLocations(int $limit = 10000): array;
    public function clearCache(): void;
    public function search(array $validated): array;
}