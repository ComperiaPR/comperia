<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Municipality;
use App\Models\PropertyType;
use App\Models\PropertyStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PropertyMapController extends Controller
{
    public function inBounds(Request $request)
    {
        $validated = $request->validate([
            'north' => 'required|numeric|between:-90,90',
            'south' => 'required|numeric|between:-90,90',
            'east' => 'required|numeric|between:-180,180',
            'west' => 'required|numeric|between:-180,180',
            'zoom' => 'required|integer|min:1|max:21',
        ]);

        // Round bounds to improve cache hit rate
        $north = round((float) $validated['north'], 4);
        $south = round((float) $validated['south'], 4);
        $east  = round((float) $validated['east'], 4);
        $west  = round((float) $validated['west'], 4);
        $zoom  = (int) $validated['zoom'];

        $limit = $this->getLimitByZoom($zoom);

        // Include version to force fresh data after writes
        $version = Cache::get('map:version', 1);
        $cacheKey = sprintf('map:bounds:%s:%s:%s:%s:z%d:v%s', $north, $south, $east, $west, $zoom, $version);

        $ttl = 300; // 5 minutes

        $payload = Cache::remember($cacheKey, $ttl, function () use ($north, $south, $east, $west, $limit) {
            $properties = Property::query()
                ->select([
                    'id', 'street', 'unit_number', 'municipality_id', 'latitude', 'longitude',
                    'sale_date', 'price_sqr_meter', 'area_sqr_feet', 'property_type_id', 'updated_at'
                ])
                ->publicWeb()
                ->inBounds($north, $south, $east, $west)
                ->orderByDesc('updated_at')
                ->limit($limit)
                ->get();

            return [
                'properties' => $properties,
                'total' => $properties->count(),
                'cached_at' => now()->toISOString(),
            ];
        });

        $payload['cache_ttl'] = $ttl;
        $payload['version'] = $version;

        return response()->json($payload);
    }

    public function clearCache(): \Illuminate\Http\JsonResponse
    {
        // Bump version, effectively invalidating all cached tiles
        Cache::increment('map:version');
        return response()->json([
            'message' => 'Map cache version bumped',
            'version' => Cache::get('map:version'),
            'cleared_at' => now()->toISOString(),
        ]);
    }

    public function lastUpdate(): \Illuminate\Http\JsonResponse
    {
        $lastUpdate = Cache::remember('map:last_update', 60, function () {
            return Property::query()
                ->publicWeb()
                ->whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->max('updated_at');
        });

        return response()->json([
            'last_update' => $lastUpdate,
            'server_time' => now()->toISOString(),
            'version' => Cache::get('map:version', 1),
        ]);
    }

    public function search(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'q' => 'nullable|string|max:255',
            'municipality_id' => 'nullable|integer|exists:municipalities,id',
            'property_type_id' => 'nullable|integer|exists:property_types,id',
            'property_status_id' => 'nullable|integer|exists:property_statuses,id',
            'north' => 'nullable|numeric|between:-90,90',
            'south' => 'nullable|numeric|between:-90,90',
            'east' => 'nullable|numeric|between:-180,180',
            'west' => 'nullable|numeric|between:-180,180',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
            'price_min' => 'nullable|numeric|min:0',
            'price_max' => 'nullable|numeric|min:0|gte:price_min',
            'area_min' => 'nullable|numeric|min:0',
            'area_max' => 'nullable|numeric|min:0|gte:area_min',
            'page' => 'nullable|integer|min:1',
        ]);

        $query = Property::query()
            ->select([
                'id', 'street', 'unit_number', 'municipality_id', 'latitude', 'longitude',
                'sale_date', 'price_sqr_meter', 'area_sqr_feet', 'property_type_id', 'property_status_id', 'updated_at'
            ])
            ->publicWeb()
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

        return response()->json($results);
    }

    public function filters(): \Illuminate\Http\JsonResponse
    {
        $data = Cache::remember('map:filters', 3600, function () {
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
                'property_statuses' => PropertyStatus::query()
                    ->select(['id', 'name'])
                    ->orderBy('name')
                    ->get(),
            ];
        });

        return response()->json($data);
    }

    private function getLimitByZoom(int $zoom): int
    {
        if ($zoom <= 10) {
            return 500;
        } elseif ($zoom <= 13) {
            return 2000;
        } elseif ($zoom <= 16) {
            return 5000;
        } else {
            return 10000;
        }
    }
}
