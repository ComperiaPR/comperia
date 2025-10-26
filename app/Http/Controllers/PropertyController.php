<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\DTOs\PropertyCreateDTO;
use App\DTOs\PropertyUpdateDTO;
use App\Http\Requests\PropertyStoreRequest;
use App\Http\Requests\PropertyUpdateRequest;
use App\Http\Resources\PropertyResource;
use App\Models\Mortgagee;
use App\Models\Municipality;
use App\Models\Property;
use App\Models\PropertyCondition;
use App\Models\PropertyStatus;
use App\Models\PropertyType;
use App\Models\TransactionType;
use App\Services\PropertyService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    private PropertyService $propertyService;

    public function __construct(PropertyService $propertyService)
    {
        $this->propertyService = $propertyService;
    }

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
        $municipalities = Municipality::get();
        $property_statuses = PropertyStatus::get();
        $transaction_types = TransactionType::get();
        $property_types = PropertyType::get();
        $mortgagees = Mortgagee::get();
        $property_conditions = PropertyCondition::get();

        return Inertia::render('dashboard/properties/create-property',[
            'municipalities' => $municipalities,
            'property_statuses' => $property_statuses,
            'transaction_types' => $transaction_types,
            'property_types' => $property_types,
            'mortgagees' => $mortgagees,
            'property_conditions' => $property_conditions,
        ]);
    }

    public function store(PropertyStoreRequest $request): RedirectResponse
    {
        // Gate::authorize(PermissionsEnum::CreateProperties);

        try {
            $this->propertyService->store($request);

            return redirect()->route('properties.create',['daily' => $request->daily]);
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
                $request
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
