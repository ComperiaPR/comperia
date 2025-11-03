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
            'properties' => $properties,
        ]);

    }

    public function create(): Response
    {
        // Gate::authorize(PermissionsEnum::CreateProperties);
        $municipalities = Municipality::orderBy('name')->get();
        $property_statuses = PropertyStatus::orderBy('name')->get();
        $transaction_types = TransactionType::orderBy('name')->get();
        $property_types = PropertyType::orderBy('name')->get();
        $mortgagees = Mortgagee::orderBy('name')->get();
        $property_conditions = PropertyCondition::orderBy('name')->get();

        return Inertia::render('dashboard/properties/create-property',[
            'municipalities' => $municipalities,
            'property_statuses' => $property_statuses,
            'transaction_types' => $transaction_types,
            'property_types' => $property_types,
            'mortgagees' => $mortgagees,
            'property_conditions' => $property_conditions,
        ]);
    }

    public function createLite(): Response
    {
        // Gate::authorize(PermissionsEnum::CreateProperties);
        $municipalities = Municipality::orderBy('name')->get();
        $property_statuses = PropertyStatus::orderBy('name')->get();
        $transaction_types = TransactionType::orderBy('name')->get();
        $property_types = PropertyType::orderBy('name')->get();
        $mortgagees = Mortgagee::orderBy('name')->get();
        $property_conditions = PropertyCondition::orderBy('name')->get();

        return Inertia::render('dashboard/properties/create-property-lite',[
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
            if($request->lite){
                return redirect()->route('properties.create-lite');
            }
            return redirect()->route('properties.create');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function show(Property $property): Response
    {
        // Gate::authorize(PermissionsEnum::ViewProperties);
        $municipalities = Municipality::orderBy('name')->get();
        $property_statuses = PropertyStatus::orderBy('name')->get();
        $transaction_types = TransactionType::orderBy('name')->get();
        $property_types = PropertyType::orderBy('name')->get();
        $mortgagees = Mortgagee::orderBy('name')->get();
        $property_conditions = PropertyCondition::orderBy('name')->get();

        return Inertia::render('dashboard/properties/update-property', [
            'property' => $property,
            'municipalities' => $municipalities,
            'property_statuses' => $property_statuses,
            'transaction_types' => $transaction_types,
            'property_types' => $property_types,
            'mortgagees' => $mortgagees,
            'property_conditions' => $property_conditions,
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

    public function view(Property $property): Response
    {
        // Gate::authorize(PermissionsEnum::ViewProperties);
        $municipalities = Municipality::orderBy('name')->get();
        $property_statuses = PropertyStatus::orderBy('name')->get();
        $transaction_types = TransactionType::orderBy('name')->get();
        $property_types = PropertyType::orderBy('name')->get();
        $mortgagees = Mortgagee::orderBy('name')->get();
        $property_conditions = PropertyCondition::orderBy('name')->get();

        return Inertia::render('dashboard/properties/view-property', [
            'property' => $property,
            'municipalities' => $municipalities,
            'property_statuses' => $property_statuses,
            'transaction_types' => $transaction_types,
            'property_types' => $property_types,
            'mortgagees' => $mortgagees,
            'property_conditions' => $property_conditions,
        ]);
    }
}
