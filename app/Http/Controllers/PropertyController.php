<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\DTOs\PropertyCreateDTO;
use App\DTOs\PropertyUpdateDTO;
use App\Enums\PropertyImprovementTypeEnum;
use App\Exports\PropertiesExport;
use App\Http\Requests\PropertyStoreRequest;
use App\Http\Requests\PropertyUpdateRequest;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
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
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class PropertyController extends Controller
{
    private PropertyService $propertyService;

    public function __construct(PropertyService $propertyService)
    {
        $this->propertyService = $propertyService;
    }

    public function index(Request $request): Response
    {
        // Gate::authorize(PermissionsEnum::ViewProperties);

        $properties = $this->propertyService->getProperties($request);

        return Inertia::render('dashboard/properties/list-properties', [
            'properties' => $properties,
            ...$this->propertySearchOptions($request),
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

        $sameLocationProperties = [];

        if (! empty($property->latitude) && ! empty($property->longitude)) {
            $sameLocationProperties = Property::query()
                ->where('id', '!=', $property->id)
                ->where('latitude', $property->latitude)
                ->where('longitude', $property->longitude)
                ->with(['municipality', 'property_type', 'transaction_type'])
                ->orderBy('id')
                ->get();
        }

        return Inertia::render('dashboard/properties/view-property', [
            'property' => $property,
            'municipalities' => $municipalities,
            'property_statuses' => $property_statuses,
            'transaction_types' => $transaction_types,
            'property_types' => $property_types,
            'mortgagees' => $mortgagees,
            'property_conditions' => $property_conditions,
            'sameLocationProperties' => $sameLocationProperties,
            'improvementTypes' => PropertyImprovementTypeEnum::labels(),
        ]);
    }

    public function list(Request $request): Response
    {
        // Gate::authorize(PermissionsEnum::ViewProperties);

        $properties = $this->propertyService->getClientProperties($request);

        return Inertia::render('dashboard/properties/client-properties', [
            'properties' => $properties,
            ...$this->propertySearchOptions($request),
        ]);
    }

    public function basicSearch(Request $request): Response
    {
        // Gate::authorize(PermissionsEnum::ViewProperties);

        $request->merge(['per_page' => $request->input('per_page', 12)]);

        $properties = $this->propertyService->getClientProperties($request);

        return Inertia::render('dashboard/properties/basic-search', [
            'properties' => $properties,
            ...$this->propertySearchOptions($request),
        ]);
    }

    /**
     * Master data + normalized filters shared by the property search views
     * (List Search and Basic Search) so they stay in sync.
     */
    private function propertySearchOptions(Request $request): array
    {
        return [
            'municipalities' => Municipality::orderBy('name')->get(['id', 'name']),
            'property_types' => PropertyType::orderBy('name')->get(['id', 'name']),
            'transaction_types' => TransactionType::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only([
                'q', 'municipality_id', 'property_type_id', 'transaction_type_id',
                'price_min', 'price_max', 'area_min', 'area_max', 'date_from', 'date_to',
            ]),
        ];
    }

    public function exportProperties(Request $request): BinaryFileResponse
    {
        $filters = $request->only(['search', 'batch']);

        $fileName = 'properties_' . date('Y-m-d_H-i-s') . '.xlsx';
        $file = new PropertiesExport($filters);
        // dd('here', $file);
        return Excel::download($file, $fileName);
    }
}
