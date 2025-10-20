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

        return response()->json($response);
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
}
