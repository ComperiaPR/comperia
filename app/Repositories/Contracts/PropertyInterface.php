<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Property;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

interface PropertyInterface
{
    public function store(Request $requestProperty): Property;
    public function update(Property $property, Request $requestProperty): Property;
    public function getProperties(): LengthAwarePaginator;
    public function getClientProperties(Request $propertyRequest): LengthAwarePaginator;
}
