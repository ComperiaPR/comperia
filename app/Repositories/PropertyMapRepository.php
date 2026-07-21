<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Municipality;
use App\Models\Property;
use App\Models\PropertyType;
use App\Models\TransactionType;
use App\Repositories\Contracts\PropertyMapInterface;
use Illuminate\Support\Facades\Cache;

class PropertyMapRepository implements PropertyMapInterface
{
    public function inBounds(array $bounds)
    {
        // Round bounds to improve cache hit rate
        $north = round((float) $bounds['north'], 4);
        $south = round((float) $bounds['south'], 4);
        $east  = round((float) $bounds['east'], 4);
        $west  = round((float) $bounds['west'], 4);
        $zoom  = (int) $bounds['zoom'];

        // Include version to force fresh data after writes
        $version = Cache::get('map:version', 1);
        $cacheKey = sprintf('map:bounds:%s:%s:%s:%s:z%d:v%s', $north, $south, $east, $west, $zoom, $version);

        $ttl = 300; // 5 minutes

        $payload = Cache::remember($cacheKey, $ttl, function () use ($north, $south, $east, $west) {
            $properties = Property::query()
                ->select([
                    'id', 'street', 'unit_number', 'municipality_id', 'latitude', 'longitude',
                    'sale_date', 'price_sqr_meter', 'area_sqr_feet', 'property_type_id', 'updated_at', 'daily'
                ])
                ->where('public_web', true)
                ->inBounds($north, $south, $east, $west)
                ->orderByDesc('updated_at')
                ->get(); // Sin límite, muestra todas las que estén en los bounds

            return [
                'properties' => $properties,
                'total' => $properties->count(),
                'cached_at' => now()->toISOString(),
            ];
        });

        $payload['cache_ttl'] = $ttl;
        $payload['version'] = $version;

        return $payload;
    }

    public function lastUpdate(int $limit)
    {
        return Property::query()
            ->select([
                'id', 'street', 'unit_number', 'municipality_id', 'latitude', 'longitude',
                'sale_date', 'price_sqr_meter', 'area_sqr_feet', 'property_type_id', 'updated_at', 'daily'
            ])
            ->publicWeb()
            ->orderByDesc('updated_at')
            ->limit($limit)
            ->get();
    }

    public function getMaxUpdatedAt(): ?string
    {
        return Property::query()
            ->publicWeb()
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->max('updated_at');
    }

    public function getFilters(): array
    {
        return [
            'municipalities' => Municipality::query()
                ->select(['id', 'name'])
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),
            'property_types' => PropertyType::query()
                ->select(['id', 'name'])
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),
            'transaction_types' => TransactionType::query()
                ->select(['id', 'name'])
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),
        ];
    }

    public function getAllLocations(int $limit = 10000): array
    {
        return Property::query()
            ->select([
                'id', 'street', 'unit_number', 'latitude', 'longitude', 
                'municipality_id', 'property_type_id', 'transaction_type_id', 
                'price', 'area_sqr_meter', 'created_at', 'daily'
            ])
            ->with(['property_type:id,type'])
            ->where('public_web', true)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->where('latitude', '!=', '')
            ->where('longitude', '!=', '')
            ->whereRaw('CAST(latitude AS DECIMAL(10,6)) > 0')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(fn($property) => [
                'id' => $property->id,
                'street' => $property->street,
                'unit_number' => $property->unit_number,
                'latitude' => $property->latitude,
                'longitude' => $property->longitude,
                'municipality_id' => $property->municipality_id,
                'property_type_id' => $property->property_type_id,
                'property_type_type' => $property->property_type ? $property->property_type->type : null,
                'transaction_type_id' => $property->transaction_type_id,
                'price' => $property->price,
                'area' => $property->area_sqr_meter,
                'created_at' => $property->created_at ? $property->created_at->toDateString() : null,
                'daily' => $property->daily,
            ])
            ->toArray();
    }

    public function clearCache(): void
    {
        $cacheFile = storage_path('app/cache/map_locations.json');
        if (file_exists($cacheFile)) {
            unlink($cacheFile);
        }

        Cache::forget('map:all_locations');
        Cache::forget('map:filters');
        Cache::increment('map:version');
    }

    public function search(array $validated): array
    {
        $query = Property::query()
            ->with(['property_type:id,type'])
            ->where('public_web', true)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->where('latitude', '!=', '')
            ->where('longitude', '!=', '');

        if (!empty($validated['q'])) {
            $q = $validated['q'];
            $query->where(function ($sub) use ($q) {
                $sub->where('street', 'like', "%{$q}%")
                    ->orWhere('unit_number', 'like', "%{$q}%")
                    ->orWhere('cadastral_number', 'like', "%{$q}%")
                    ->orWhere('registry_number', 'like', "%{$q}%")
                    ->orWhere('id', 'like', "%{$q}%");
            });
        }

        if (!empty($validated['municipality_id'])) {
            $query->whereIn('municipality_id', $this->normalizeArrayParam($validated['municipality_id']));
        }

        if (!empty($validated['property_type_id'])) {
            $query->whereIn('property_type_id', $this->normalizeArrayParam($validated['property_type_id']));
        }

        if (!empty($validated['transaction_type_id'])) {
            $query->whereIn('transaction_type_id', $this->normalizeArrayParam($validated['transaction_type_id']));
        }

        if (!empty($validated['date_from'])) {
            $query->whereDate('created_at', '>=', $validated['date_from']);
        }

        if (!empty($validated['date_to'])) {
            $query->whereDate('created_at', '<=', $validated['date_to']);
        }

        if (!empty($validated['price_min'])) {
            $query->where('price', '>=', (float)$validated['price_min']);
        }
        if (!empty($validated['price_max'])) {
            $query->where('price', '<=', (float)$validated['price_max']);
        }
        if (!empty($validated['area_min'])) {
            $query->where('area_sqr_meter', '>=', (float)$validated['area_min']);
        }
        if (!empty($validated['area_max'])) {
            $query->where('area_sqr_meter', '<=', (float)$validated['area_max']);
        }

        $perPage = $validated['per_page'] ?? 10000;
        $properties = $query->limit($perPage)->get();

        return $properties->map(fn($property) => [
            'id' => $property->id,
            'street' => $property->street,
            'unit_number' => $property->unit_number,
            'latitude' => $property->latitude,
            'longitude' => $property->longitude,
            'municipality_id' => $property->municipality_id,
            'property_type_id' => $property->property_type_id,
            'property_type_type' => $property->property_type ? $property->property_type->type : null,
            'transaction_type_id' => $property->transaction_type_id,
            'price' => $property->price,
            'area' => $property->area_sqr_meter,
            'created_at' => $property->created_at ? $property->created_at->toDateString() : null,
            'daily' => $property->daily,
        ])->values()->toArray();
    }

    private function normalizeArrayParam($param): array
    {
        if (is_array($param)) {
            return array_filter(array_map('intval', $param));
        }

        if (is_string($param)) {
            if (strpos($param, ',') !== false) {
                return array_filter(array_map('intval', explode(',', $param)));
            }
            return [(int)$param];
        }

        if (is_numeric($param)) {
            return [(int)$param];
        }

        return [];
    }
}
