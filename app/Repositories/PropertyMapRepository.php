<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Property;
use App\Repositories\Contracts\PropertyMapInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

// use Illuminate\Support\Facades\Request;

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

    public function clearCache(): void
    {
        // Implement the logic to clear the cache
    }

    public function search(array $validated): LengthAwarePaginator
    {
        $query = Property::query()
            ->select([
                'id', 'street', 'unit_number', 'municipality_id', 'latitude', 'longitude',
                'sale_date', 'price_sqr_meter', 'area_sqr_feet', 'property_type_id', 'property_status_id', 'updated_at', 'daily'
            ])
            ->where('public_web', true)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->with([
                'municipality:id,name',
                'property_type:id,name',
                'property_status:id,name',
            ]);

        if (!empty($validated['q'])) {
            $q = $validated['q'];
            $query->where(function ($sub) use ($q) {
                $sub->where('street', 'like', "%{$q}%")
                    ->orWhere('unit_number', 'like', "%{$q}%")
                    ->orWhere('cadastre', 'like', "%{$q}%")
                    ->orWhere('registry', 'like', "%{$q}%");
            });
        }

        if (!empty($validated['municipality_id'])) {
            $query->where('municipality_id', (int) $validated['municipality_id']);
        }
        if (!empty($validated['property_type_id'])) {
            $query->where('property_type_id', (int) $validated['property_type_id']);
        }
        if (!empty($validated['property_status_id'])) {
            $query->where('property_status_id', (int) $validated['property_status_id']);
        }

        // Date range filter
        if (!empty($validated['date_from'])) {
            $query->where('sale_date', '>=', $validated['date_from']);
        }
        if (!empty($validated['date_to'])) {
            $query->where('sale_date', '<=', $validated['date_to']);
        }

        // Price range filter
        if (!empty($validated['price_min'])) {
            $query->where('price_sqr_meter', '>=', (float) $validated['price_min']);
        }
        if (!empty($validated['price_max'])) {
            $query->where('price_sqr_meter', '<=', (float) $validated['price_max']);
        }

        // Area range filter
        if (!empty($validated['area_min'])) {
            $query->where('area_sqr_feet', '>=', (float) $validated['area_min']);
        }
        if (!empty($validated['area_max'])) {
            $query->where('area_sqr_feet', '<=', (float) $validated['area_max']);
        }

        // Optional bounds filter (when toggled from UI)
        if (isset($validated['north'], $validated['south'], $validated['east'], $validated['west'])) {
            $north = (float) $validated['north'];
            $south = (float) $validated['south'];
            $east = (float) $validated['east'];
            $west = (float) $validated['west'];
            $query->inBounds($north, $south, $east, $west);
        }

        $results = $query
            ->orderByDesc('updated_at')
            ->paginate(15)
            ->withQueryString();

        return $results;
    }

    private function getLimitByZoom(int $zoom): int
    {
        if ($zoom <= 10) {
            return 1000;
        } elseif ($zoom <= 13) {
            return 5000;
        } elseif ($zoom <= 16) {
            return 15000;
        } else {
            return 50000; // Aumentado para mostrar más propiedades en zoom cercano
        }
    }
}
    