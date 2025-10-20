<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface PropertyMapInterface
{
    public function inBounds(array $bounds);
    public function lastUpdate(int $limit);
    public function clearCache(): void;
    public function search(array $query): LengthAwarePaginator;
}