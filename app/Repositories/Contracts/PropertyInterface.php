<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
// use Illuminate\Support\Facades\Request;

interface PropertyInterface
{
    public function store(Request $requestProperty): Property;
    public function update(Property $property, Request $requestProperty): Property;
    public function getProperties(): Collection;
}
