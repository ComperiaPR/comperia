# Guía de Migración: De DTOs/Resources a Eloquent Directo

## Objetivo

Este documento muestra cómo migrar código legacy que usa DTOs, Resources y Repositories al nuevo enfoque pragmático con Eloquent directo.

---

## Antes vs Después

### Ejemplo 1: CRUD Simple (Property)

#### Antes (enfoque heredado con DTOs/Resources)

**Archivos involucrados: 7**

```php
// 1. app/DTOs/PropertyCreateDTO.php
final readonly class PropertyCreateDTO
{
    public function __construct(
        public readonly string $registry,
        public readonly int $deed_no,
        public readonly string $sale_date,
        public readonly int $municipality_id,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            registry: $data['registry'],
            deed_no: $data['deed_no'],
            sale_date: $data['sale_date'],
            municipality_id: $data['municipality_id'],
        );
    }
}

// 2. app/Repositories/Contracts/PropertyInterface.php
interface PropertyInterface
{
    public function store(PropertyCreateDTO $dto): Property;
    public function getProperties(): Collection;
}

// 3. app/Repositories/PropertyRepository.php
class PropertyRepository implements PropertyInterface
{
    public function store(PropertyCreateDTO $dto): Property
    {
        return Property::create([
            'registry' => $dto->registry,
            'deed_no' => $dto->deed_no,
            'sale_date' => $dto->sale_date,
            'municipality_id' => $dto->municipality_id,
        ]);
    }

    public function getProperties(): Collection
    {
        return Property::with('municipality')->get();
    }
}

// 4. app/Services/PropertyService.php
class PropertyService
{
    public function __construct(
        private PropertyInterface $repository
    ) {}

    public function store(PropertyCreateDTO $dto): Property
    {
        return $this->repository->store($dto);
    }

    public function getProperties(): Collection
    {
        return $this->repository->getProperties();
    }
}

// 5. app/Http/Resources/PropertyResource.php
class PropertyResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'registry' => $this->registry,
            'deed_no' => $this->deed_no,
            'sale_date' => $this->sale_date->format('Y-m-d'),
            'municipality' => [
                'id' => $this->municipality->id,
                'name' => $this->municipality->name,
            ],
        ];
    }
}

// 6. app/Http/Requests/PropertyStoreRequest.php
class PropertyStoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'registry' => 'required|string',
            'deed_no' => 'required|integer',
            'sale_date' => 'required|date',
            'municipality_id' => 'required|exists:municipalities,id',
        ];
    }
}

// 7. app/Http/Controllers/PropertyController.php
class PropertyController extends Controller
{
    public function __construct(
        private PropertyService $service
    ) {}

    public function index()
    {
        $properties = $this->service->getProperties();

        return Inertia::render('Properties/Index', [
            'properties' => PropertyResource::collection($properties),
        ]);
    }

    public function store(PropertyStoreRequest $request)
    {
        $dto = PropertyCreateDTO::fromArray($request->validated());
        $property = $this->service->store($dto);

        return redirect()->route('properties.show', $property);
    }
}
```

**Problemas:**
- 7 archivos para un CRUD simple
- Cambio de columna → actualizar DTO + Resource + Repository
- Stack trace largo en errores: Controller → Service → Repository → Model
- Difícil debuggear: ¿el bug está en DTO, Service o Repository?

---

#### ✅ DESPUÉS (Nuevo enfoque pragmático)

**Archivos involucrados: 2**

```php
// 1. app/Http/Requests/PropertyStoreRequest.php
class PropertyStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Property::class);
    }

    public function rules(): array
    {
        return [
            'registry' => ['required', 'string', 'max:255'],
            'deed_no' => ['required', 'integer'],
            'sale_date' => ['required', 'date'],
            'municipality_id' => ['required', 'exists:municipalities,id'],
            'property_type_id' => ['required', 'exists:property_types,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'municipality_id.exists' => 'El municipio seleccionado no es válido.',
            'deed_no.integer' => 'El número de escritura debe ser numérico.',
        ];
    }
}

// 2. app/Http/Controllers/PropertyController.php
class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $properties = Property::query()
            ->with([
                'municipality:id,name',
                'propertyType:id,name'
            ])
            ->select([
                'id', 'registry', 'deed_no', 'sale_date',
                'municipality_id', 'property_type_id'
            ])
            ->when($request->search, function($q, $search) {
                $q->where('registry', 'like', "%{$search}%");
            })
            ->latest('sale_date')
            ->paginate(20);

        return Inertia::render('Properties/Index', [
            'properties' => $properties,
        ]);
    }

    public function store(PropertyStoreRequest $request)
    {
        $property = Property::create($request->validated());

        return redirect()
            ->route('properties.show', $property)
            ->with('success', 'Propiedad creada exitosamente');
    }

    public function update(Property $property, PropertyUpdateRequest $request)
    {
        $property->update($request->validated());

        return back()->with('success', 'Propiedad actualizada');
    }
}
```

**Ventajas:**
- ✅ 2 archivos vs 7 (5 archivos menos)
- ✅ Cambio de columna → solo migración + Request (si necesita validación)
- ✅ Stack trace corto: Controller → Model → DB
- ✅ Debugging fácil: todo está en el Controller
- ✅ Eager loading selectivo = mejor performance

---

## Ejemplo 2: Lógica Compleja (Importación Masiva)

### ✅ CUÁNDO SÍ usar Service

```php
// app/Services/PropertyImportService.php
class PropertyImportService
{
    public function __construct(
        private GeocodingService $geocoding,
        private LoggerInterface $logger
    ) {}

    public function importFromCSV(UploadedFile $file): ImportResult
    {
        $errors = [];
        $imported = 0;

        DB::beginTransaction();

        try {
            $rows = Excel::toCollection(new PropertyImport, $file)->first();

            foreach ($rows as $index => $row) {
                try {
                    // 1. Validar/crear municipio
                    $municipality = $this->findOrCreateMunicipality($row['municipio']);

                    // 2. Calcular métricas
                    $pricePerSqm = $this->calculatePricePerSqm(
                        $row['precio_total'],
                        $row['area_m2']
                    );

                    // 3. Geocodificar dirección
                    $coords = $this->geocoding->geocode($row['direccion']);

                    // 4. Crear property
                    $property = Property::create([
                        'registry' => $row['registro'],
                        'deed_no' => $row['escritura'],
                        'sale_date' => Carbon::parse($row['fecha_venta']),
                        'municipality_id' => $municipality->id,
                        'area_sqr_meter' => $row['area_m2'],
                        'price_sqr_meter' => $pricePerSqm,
                        'latitude' => $coords['lat'],
                        'longitude' => $coords['lng'],
                    ]);

                    $imported++;
                    $this->logger->info("Property imported: {$property->registry}");

                } catch (\Exception $e) {
                    $errors[] = "Fila {$index}: {$e->getMessage()}";
                    $this->logger->warning("Import error at row {$index}", [
                        'error' => $e->getMessage(),
                        'row' => $row
                    ]);
                }
            }

            DB::commit();

            return new ImportResult(
                success: count($errors) === 0,
                imported: $imported,
                errors: $errors,
                total: $rows->count()
            );

        } catch (\Exception $e) {
            DB::rollBack();
            $this->logger->error("Import failed", ['error' => $e->getMessage()]);
            throw new ImportException("Error general: {$e->getMessage()}");
        }
    }

    private function findOrCreateMunicipality(string $name): Municipality
    {
        return Municipality::firstOrCreate(
            ['name' => $name],
            ['is_active' => true, 'latitude' => '0', 'longitude' => '0']
        );
    }

    private function calculatePricePerSqm(float $totalPrice, float $area): float
    {
        if ($area <= 0) {
            throw new \InvalidArgumentException('Área debe ser mayor a 0');
        }
        return round($totalPrice / $area, 2);
    }
}

// Controller simple que delega
class PropertyImportController extends Controller
{
    public function __construct(
        private PropertyImportService $importService
    ) {}

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,xlsx|max:10240'
        ]);

        try {
            $result = $this->importService->importFromCSV($request->file('file'));

            if ($result->success) {
                return back()->with('success', "Importadas {$result->imported} propiedades");
            } else {
                return back()->with('warning', "Importadas con errores")
                    ->with('errors', $result->errors);
            }

        } catch (ImportException $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
```

**¿Por qué aquí SÍ usamos Service?**
- ✅ Lógica compleja multi-paso (validar, geocodificar, calcular, crear)
- ✅ Transacciones con rollback
- ✅ Logging detallado
- ✅ Reutilizable (puedes llamarlo desde Command, Job, Listener)
- ✅ Testing más fácil (mock el Service en vez de todo el Controller)

---

## Paso a Paso: Migrando un Controller Legacy

### 1. Identificar qué puedes eliminar

```php
// ANTES
class PropertyController extends Controller
{
    public function __construct(
        private PropertyService $service  // ← ¿Realmente necesario?
    ) {}

    public function index()
    {
        $properties = $this->service->getProperties();  // ← Solo llama al repo

        return Inertia::render('Properties/Index', [
            'properties' => PropertyResource::collection($properties),  // ← Solo transforma
        ]);
    }
}
```

**Preguntas a hacer:**
1. ¿El Service tiene lógica compleja? → **NO** (solo llama al Repository)
2. ¿El Resource transforma data de forma compleja? → **NO** (solo mapea campos)
3. ¿Necesito reutilizar esta lógica en otro lado? → **NO** (solo en este endpoint)

**Conclusión:** Eliminar Service + Resource, usar Eloquent directo.

---

### 2. Refactorizar gradualmente

**Paso 2.1:** Eliminar DTO, usar `$request->validated()` directo

```php
// ANTES
public function store(PropertyStoreRequest $request)
{
    $dto = PropertyCreateDTO::fromArray($request->validated());
    $property = $this->service->store($dto);
    // ...
}

// DESPUÉS
public function store(PropertyStoreRequest $request)
{
    $property = Property::create($request->validated());
    return redirect()->route('properties.show', $property);
}
```

**Paso 2.2:** Eliminar Resource, ajustar eager loading

```php
// ANTES
public function index()
{
    $properties = $this->service->getProperties();
    return Inertia::render('Properties/Index', [
        'properties' => PropertyResource::collection($properties),
    ]);
}

// DESPUÉS
public function index()
{
    $properties = Property::with('municipality:id,name')
        ->select(['id', 'registry', 'municipality_id'])
        ->paginate(20);

    return Inertia::render('Properties/Index', [
        'properties' => $properties,
    ]);
}
```

**Paso 2.3:** Eliminar Service (si no tiene lógica compleja)

```php
// Borrar:
// - app/Services/PropertyService.php
// - app/Repositories/PropertyRepository.php
// - app/Repositories/Contracts/PropertyInterface.php

// En AppServiceProvider, quitar:
// $this->app->bind(PropertyInterface::class, PropertyRepository::class);
```

**Paso 2.4:** Actualizar tests

```php
// ANTES
test('can create property', function () {
    $dto = PropertyCreateDTO::fromArray([...]);
    $property = $this->propertyService->store($dto);
    // ...
});

// DESPUÉS
test('can create property', function () {
    $data = Property::factory()->make()->toArray();
    
    $response = $this->actingAs(User::factory()->create())
        ->post(route('properties.store'), $data);

    $response->assertRedirect();
    $this->assertDatabaseHas('properties', ['registry' => $data['registry']]);
});
```

---

## Checklist de Migración

Para cada Controller legacy:

- [ ] **Analizar Service:**
  - ¿Tiene lógica compleja? → Mantener
  - ¿Solo llama Repository? → Eliminar

- [ ] **Analizar Repository:**
  - ¿Queries complejas reutilizables? → Mover a Model Scopes
  - ¿Solo wrappers de Eloquent? → Eliminar

- [ ] **Analizar DTO:**
  - ¿Validación compleja? → Mover a FormRequest
  - ¿Solo contenedor de data? → Eliminar, usar `$request->validated()`

- [ ] **Analizar Resource:**
  - ¿Transformaciones complejas? → Mantener
  - ¿Solo mapeo 1:1 de campos? → Eliminar, usar `select()` + `with()`

- [ ] **Actualizar Controller:**
  - Inyectar solo lo necesario (ej: Service complejo)
  - Usar Eloquent directo con eager loading
  - Retornar data sin Resource (Inertia serializa automáticamente)

- [ ] **Actualizar Tests:**
  - Eliminar mocks de Services/Repositories
  - Usar factories para data de prueba
  - Testear comportamiento, no implementación

- [ ] **Verificar Performance:**
  - Ejecutar con Laravel Debugbar
  - Verificar N+1 queries resueltas
  - Medir tamaño de payload (Network tab)

---

## Casos Especiales

### API Pública (mantener Resources)

Si tu endpoint se consume externamente o necesitas versionado:

```php
// API v1 con Resource (contrato estable)
Route::prefix('v1')->group(function() {
    Route::get('properties', function() {
        return PropertyResource::collection(
            Property::with('municipality')->paginate(20)
        );
    });
});

// API interna con Eloquent directo (flexibilidad)
Route::prefix('internal')->group(function() {
    Route::get('properties', function(Request $request) {
        return Property::with($request->query('include', []))
            ->select($request->query('fields', ['*']))
            ->paginate(20);
    });
});
```

### Lógica de Negocio Compleja (mantener Service)

```php
// Service justificado: múltiples pasos, transacciones, logs
class PropertyTransferService
{
    public function transferOwnership(
        Property $property,
        User $newOwner,
        string $deed_no
    ): TransferResult {
        DB::beginTransaction();

        try {
            // 1. Validar que newOwner puede comprar
            if (!$newOwner->canPurchase($property->price)) {
                throw new InsufficientFundsException();
            }

            // 2. Crear transacción histórica
            $transaction = PropertyTransaction::create([...]);

            // 3. Actualizar property ownership
            $property->update(['owner_id' => $newOwner->id]);

            // 4. Enviar notificaciones
            $newOwner->notify(new PropertyAcquired($property));
            $property->previousOwner->notify(new PropertySold($property));

            // 5. Registrar en blockchain (si aplica)
            $this->blockchainService->recordTransfer($property, $transaction);

            DB::commit();

            return new TransferResult(success: true, transaction: $transaction);

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
```

---

## Conclusión

**Regla de oro:**

> Si solo estás moviendo data de A → B sin transformar ni validar,  
> **NO necesitas** DTO/Service/Repository/Resource.  
> Usa Eloquent directo.

**Cuándo SÍ usar abstracciones:**
- Lógica de negocio compleja (>3 pasos)
- Transacciones multi-modelo
- Código reutilizable (Commands, Jobs, Listeners)
- APIs públicas con versionado

**Cuando NO usar abstracciones:**
- CRUDs simples
- Listados con filtros
- Formularios básicos
- SPAs internas (Inertia)

---

**Última actualización:** Octubre 2025  
**Autor:** Equipo Tech Comperia
