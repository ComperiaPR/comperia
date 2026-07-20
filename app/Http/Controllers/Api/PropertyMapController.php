<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PropertyMapInBoundsRequest;
use App\Http\Requests\PropertyMapSearchRequest;
use Illuminate\Support\Facades\Cache;
use App\Services\PropertyMapService;
use Illuminate\Http\JsonResponse;

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

    public function lastUpdate(): JsonResponse
    {
        $lastUpdate = Cache::remember('map:last_update', 60, function () {
            return $this->propertyMapService->getMaxUpdatedAt();
        });

        return response()->json([
            'last_update' => $lastUpdate,
            'server_time' => now()->toISOString(),
            'version' => Cache::get('map:version', 1),
        ]);
    }

    public function filters(): JsonResponse
    {
        $data = Cache::remember('map:filters', 3600, function () {
            return $this->propertyMapService->getFilters();
        });

        return response()->json($data);
    }

    public function allLocations(): JsonResponse
    {
        $cacheKey = 'map:all_locations';
        $cacheFile = storage_path('app/cache/map_locations.json');
        $cacheTime = 3600;

        if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheTime) {
            $data = json_decode(file_get_contents($cacheFile), true);
        }

        $properties = $this->propertyMapService->getAllLocations(10000);

        $data = [
            'properties' => $properties,
            'total' => count($properties),
            'cached_at' => now()->toISOString(),
            'version' => Cache::get('map:version', 1),
        ];

        if (!is_dir(dirname($cacheFile))) {
            mkdir(dirname($cacheFile), 0755, true);
        }
        file_put_contents($cacheFile, json_encode($data));

        return response()->json($data);
    }

    public function search(PropertyMapSearchRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $data = $this->propertyMapService->search($validated);

        return response()->json([
            'data' => $data,
            'total' => count($data),
            'filters_applied' => $request->except(['per_page', 'page']),
        ]);
    }

    public function clearCache(): JsonResponse
    {
        $cacheFile = storage_path('app/cache/map_locations.json');

        if (file_exists($cacheFile)) {
            unlink($cacheFile);
        }

        Cache::forget('map:all_locations');
        Cache::forget('map:filters');
        Cache::increment('map:version');

        return response()->json([
            'message' => 'Caché limpiado exitosamente',
            'new_version' => Cache::get('map:version', 1),
        ]);
    }
}
