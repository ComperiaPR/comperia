<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PropertyMapInBoundsRequest;
use App\Http\Requests\PropertyMapSearchRequest;
use App\Models\Property;
use App\Models\Municipality;
use App\Models\PropertyType;
use App\Models\PropertyStatus;
use Illuminate\Support\Facades\Cache;
use App\Services\PropertyMapService;

class PropertyMapController extends Controller
{
    private PropertyMapService $propertyMapService;

    public function __construct(PropertyMapService $propertyMapService)
    {
        $this->propertyMapService = $propertyMapService;
    }

    public function inBounds(PropertyMapInBoundsRequest $request)
    {
        $validated = $request->validated();

        $response = $this->propertyMapService->inBounds($validated);

        logger()->info('Map inBounds request', [
            'bounds' => $validated,
            'response_total' => $response['total'] ?? 0,
            'cached' => isset($response['cached_at']),
        ]);

        return response()->json($response);
    }

    public function clearCache(): \Illuminate\Http\JsonResponse
    {
        // Bump version, effectively invalidating all cached tiles
        Cache::increment('map:version');
        
        // Clear file cache
        $cacheFile = storage_path('app/cache/map_locations.json');
        if (file_exists($cacheFile)) {
            unlink($cacheFile);
        }
        
        return response()->json([
            'message' => 'Map cache cleared',
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

    public function search(PropertyMapSearchRequest $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validated();

        $results = $this->propertyMapService->search($validated);

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

    public function allLocations(): \Illuminate\Http\JsonResponse
    {
        // Use file cache instead of database for large datasets
        $cacheKey = 'map:all_locations';
        $cacheFile = storage_path('app/cache/map_locations.json');
        $cacheTime = 3600; // 1 hour
        
        // Check if cache file exists and is fresh
        if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheTime) {
            $data = json_decode(file_get_contents($cacheFile), true);
            return response()->json($data);
        }

        // Build fresh data
        $properties = Property::query()
            ->select(['id', 'street', 'unit_number', 'latitude', 'longitude'])
            ->where('public_web', true)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->where('latitude', '!=', '')
            ->where('longitude', '!=', '')
            ->whereRaw('CAST(latitude AS DECIMAL(10,6)) > 0')
            ->get()
            ->map(function ($property) {
                // Convert to plain array to reduce size
                return [
                    'id' => $property->id,
                    'street' => $property->street,
                    'unit_number' => $property->unit_number,
                    'latitude' => $property->latitude,
                    'longitude' => $property->longitude,
                ];
            })
            ->values()
            ->toArray();

        $data = [
            'properties' => $properties,
            'total' => count($properties),
            'cached_at' => now()->toISOString(),
            'version' => Cache::get('map:version', 1),
        ];

        // Save to file cache
        if (!is_dir(dirname($cacheFile))) {
            mkdir(dirname($cacheFile), 0755, true);
        }
        file_put_contents($cacheFile, json_encode($data));

        return response()->json($data);
    }
}
