<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PropertyMapInBoundsRequest;
use App\Models\Property;
use App\Models\Municipality;
use App\Models\PropertyType;
use App\Models\PropertyStatus;
use App\Models\TransactionType;
use Illuminate\Support\Facades\Cache;
use App\Services\PropertyMapService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

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

    public function filters(): JsonResponse
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
                'transaction_types' => TransactionType::query()
                    ->select(['id', 'name'])
                    ->where('is_active', true)
                    ->orderBy('name')
                    ->get(),
            ];
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
            // return response()->json($data);
        }

        $properties = Property::query()
            ->select([
                'id', 'street', 'unit_number', 'latitude', 'longitude', 
                'municipality_id', 'property_type_id', 'transaction_type_id', 
                'price', 'area_sqr_meter', 'created_at', 'daily'
            ])
            ->where('public_web', true)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->where('latitude', '!=', '')
            ->where('longitude', '!=', '')
            ->whereRaw('CAST(latitude AS DECIMAL(10,6)) > 0')
            ->get()
            ->map(fn($property) => [
                'id' => $property->id,
                'street' => $property->street,
                'unit_number' => $property->unit_number,
                'latitude' => $property->latitude,
                'longitude' => $property->longitude,
                'municipality_id' => $property->municipality_id,
                'property_type_id' => $property->property_type_id,
                'transaction_type_id' => $property->transaction_type_id,
                'price' => $property->price,
                'area' => $property->area_sqr_meter,
                'created_at' => $property->created_at ? $property->created_at->toDateString() : null,
                'daily' => $property->daily,
            ])
            ->values()
            ->toArray();

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

    public function search(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'q' => 'nullable|string|max:255',
            'municipality_id' => 'nullable|array',
            'municipality_id.*' => 'integer|exists:municipalities,id',
            'property_type_id' => 'nullable|array',
            'property_type_id.*' => 'integer|exists:property_types,id',
            'transaction_type_id' => 'nullable|array',
            'transaction_type_id.*' => 'integer',
            'price_min' => 'nullable|numeric|min:0',
            'price_max' => 'nullable|numeric|min:0',
            'area_min' => 'nullable|numeric|min:0',
            'area_max' => 'nullable|numeric|min:0',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos de validación inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $query = Property::query()
            ->select([
                'id', 'street', 'unit_number', 'latitude', 'longitude',
                'municipality_id', 'property_type_id', 'transaction_type_id',
                'price', 'area_sqr_meter', 'created_at', 'daily'
            ])
            ->where('public_web', true)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->where('latitude', '!=', '')
            ->where('longitude', '!=', '');

        if ($request->filled('q')) {
            $searchTerm = $request->input('q');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('street', 'like', "%{$searchTerm}%")
                  ->orWhere('unit_number', 'like', "%{$searchTerm}%")
                  ->orWhere('cadastral_number', 'like', "%{$searchTerm}%")
                  ->orWhere('registry_number', 'like', "%{$searchTerm}%");
            });
        }

        if ($request->filled('municipality_id')) {
            $municipalityIds = $this->normalizeArrayParam($request->input('municipality_id'));
            if (!empty($municipalityIds)) {
                $query->whereIn('municipality_id', $municipalityIds);
            }
        }

        if ($request->filled('property_type_id')) {
            $propertyTypeIds = $this->normalizeArrayParam($request->input('property_type_id'));
            if (!empty($propertyTypeIds)) {
                $query->whereIn('property_type_id', $propertyTypeIds);
            }
        }

        if ($request->filled('transaction_type_id')) {
            $transactionTypeIds = $this->normalizeArrayParam($request->input('transaction_type_id'));
            if (!empty($transactionTypeIds)) {
                $query->whereIn('transaction_type_id', $transactionTypeIds);
            }
        }

        if ($request->filled('price_min')) {
            $query->where('price_', '>=', $request->input('price_min'));
        }

        if ($request->filled('price_max')) {
            $query->where('price', '<=', $request->input('price_max'));
        }

        if ($request->filled('area_min')) {
            $query->where('area_sqr_meter', '>=', $request->input('area_min'));
        }

        if ($request->filled('area_max')) {
            $query->where('area_sqr_meter', '<=', $request->input('area_max'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }

        $perPage = $request->input('per_page', 1000);
        $properties = $query->get();

        $data = $properties->map(fn($property) => [
            'id' => $property->id,
            'street' => $property->street,
            'unit_number' => $property->unit_number,
            'latitude' => $property->latitude,
            'longitude' => $property->longitude,
            'municipality_id' => $property->municipality_id,
            'property_type_id' => $property->property_type_id,
            'transaction_type_id' => $property->transaction_type_id,
            'price' => $property->price,
            'area' => $property->area_sqr_meter,
            'created_at' => $property->created_at ? $property->created_at->toDateString() : null,
            'daily' => $property->daily,
        ])->values();

        return response()->json([
            'data' => $data,
            'total' => $data->count(),
            'filters_applied' => $request->except(['per_page']),
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
