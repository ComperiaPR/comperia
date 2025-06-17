<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\DTOs\PropertyCreateDTO;
use App\DTOs\PropertyUpdateDTO;
use App\Http\Requests\PropertyStoreRequest;
use App\Http\Requests\PropertyUpdateRequest;
use App\Http\Resources\PropertyResource;
use App\Models\Property;
use App\Services\PropertyService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    public function __construct(private PropertyService $propertyService)
    { }

    public function index(): Response
    {
        // Gate::authorize(PermissionsEnum::ViewProperties);

        $properties = $this->propertyService->getProperties();

        return Inertia::render('dashboard/properties/list-properties', [
            'properties' => PropertyResource::collection($properties),
        ]);
    }

    public function create(): Response
    {
        // Gate::authorize(PermissionsEnum::CreateProperties);

        return Inertia::render('dashboard/properties/create-property');
    }

    public function store(PropertyStoreRequest $request): RedirectResponse
    {
        // Gate::authorize(PermissionsEnum::CreateProperties);

        try {
            $this->propertyService->store(
                PropertyCreateDTO::fromArray($request->validated())
            );

            return redirect()->route('properties.index');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function show(Property $property): Response
    {
        // Gate::authorize(PermissionsEnum::ViewProperties);

        return Inertia::render('dashboard/properties/update-property', [
            'property' => new PropertyResource($property),
        ]);
    }

    public function update(Property $property, PropertyUpdateRequest $request)
    {
        // Gate::authorize(PermissionsEnum::UpdateProperties);

        try {
            $this->propertyService->update(
                $property,
                PropertyUpdateDTO::fromArray($request->validated())
            );

            return redirect()->route('properties.index');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function destroy(Property $property)
    {
        $property->delete();
        return back();
    }
}
