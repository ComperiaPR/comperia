# Guía de desarrollo - Comperia

## Resumen: flujo de trabajo para nuevas funcionalidades

```bash
# 1. Si la tabla ya existe en DB, generar modelo
php artisan code:models --table=nueva_tabla

# 2. Crear FormRequest para validación
php artisan make:request NuevaTablaStoreRequest

# 3. Crear Controller
php artisan make:controller NuevaTablaController --resource

# 4. Implementar con Eloquent de forma directa (sin DTOs)
# Véase ejemplos en las secciones siguientes
```

---

## Lista de verificación: nueva funcionalidad de CRUD

### Backend (15-30 minutos)

- [ ] **Migración + Seeder** (si tabla nueva)
  ```bash
  php artisan make:migration create_nueva_tabla_table
  php artisan make:seeder NuevaTablaSeeder
  ```

- [ ] **Modelo generado automáticamente**
  ```bash
  php artisan code:models --table=nueva_tabla
  ```
  
    Verificar: `$fillable`, `$casts`, relaciones

- [ ] **FormRequests (validación)**
  ```bash
  php artisan make:request NuevaTablaStoreRequest
  php artisan make:request NuevaTablaUpdateRequest
  ```
  
    Añadir reglas y mensajes en español

- [ ] **Controller con eager loading**
  ```php
  public function index()
  {
      return Inertia::render('NuevaTabla/Index', [
          'items' => NuevaTabla::with('relacion:id,name')
              ->select(['id', 'name', 'relacion_id'])
              ->paginate(20)
      ]);
  }
  ```

- [ ] **Rutas en `routes/web.php`**
  ```php
  Route::resource('nueva-tabla', NuevaTablaController::class);
  ```

- [ ] **Factory para testing**
  ```bash
  php artisan make:factory NuevaTablaFactory
  ```

### Frontend (20-40 minutos)

- [ ] **Página Index** (`resources/js/pages/NuevaTabla/Index.tsx`)
- [ ] **Página Create** (`resources/js/pages/NuevaTabla/Create.tsx`)
- [ ] **Página Edit** (`resources/js/pages/NuevaTabla/Edit.tsx`)
- [ ] **Componentes reutilizables** (`resources/js/components/NuevaTabla/`)

### Testing

- [ ] **Feature test**
  ```bash
  php artisan make:test NuevaTablaTest
  ```
  
  ```php
  test('can create nueva_tabla', function () {
      $data = NuevaTabla::factory()->make()->toArray();
      
      $response = $this->actingAs(User::factory()->create())
          ->post(route('nueva-tabla.store'), $data);
      
      $response->assertRedirect(route('nueva-tabla.index'));
      $this->assertDatabaseHas('nueva_tabla', ['name' => $data['name']]);
  });
  ```

- [ ] **Ejecutar tests**
  ```bash
  php artisan test --filter=NuevaTablaTest
  ```

---

## Patrones de Código Comunes

### 1. CRUD Básico (sin Service)

```php
// Controller: PropertyController.php
class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $properties = Property::query()
            ->with([
                'municipality:id,name',
                'propertyType:id,name',
                'propertyStatus:id,name,color'
            ])
            ->select([
                'id', 'registry', 'deed_no', 'sale_date',
                'municipality_id', 'property_type_id', 'property_status_id'
            ])
            ->when($request->search, function($q, $search) {
                $q->where('registry', 'like', "%{$search}%")
                  ->orWhere('deed_no', $search);
            })
            ->latest('sale_date')
            ->paginate(20);

        return Inertia::render('Properties/Index', [
            'properties' => $properties,
            'filters' => $request->only('search')
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

    public function destroy(Property $property)
    {
        $property->delete();

        return redirect()
            ->route('properties.index')
            ->with('success', 'Propiedad eliminada');
    }
}
```

### 2. Queries Complejas con Filtros Dinámicos

```php
public function index(Request $request)
{
    $query = Property::query()
        ->with([
            'municipality:id,name',
            'propertyType:id,name'
        ])
        ->select([
            'id', 'registry', 'sale_date', 'area_sqr_meter',
            'municipality_id', 'property_type_id'
        ]);

    // Filtro por municipio
    if ($request->filled('municipality_id')) {
        $query->where('municipality_id', $request->municipality_id);
    }

    // Filtro por rango de fechas
    if ($request->filled(['date_from', 'date_to'])) {
        $query->whereBetween('sale_date', [
            $request->date_from,
            $request->date_to
        ]);
    }

    // Filtro por área mínima
    if ($request->filled('min_area')) {
        $query->where('area_sqr_meter', '>=', $request->min_area);
    }

    // Búsqueda general
    if ($request->filled('search')) {
        $query->where(function($q) use ($request) {
            $q->where('registry', 'like', "%{$request->search}%")
              ->orWhere('deed_no', $request->search)
              ->orWhereHas('municipality', function($q) use ($request) {
                  $q->where('name', 'like', "%{$request->search}%");
              });
        });
    }

    $properties = $query->latest('sale_date')->paginate(20);

    return Inertia::render('Properties/Index', [
        'properties' => $properties,
        'filters' => $request->only([
            'municipality_id', 'date_from', 'date_to', 'min_area', 'search'
        ]),
        'municipalities' => Municipality::select('id', 'name')
            ->where('is_active', true)
            ->get()
    ]);
}
```

### 3. Relaciones Nested con Selectores Específicos

```php
public function show(Property $property)
{
    $property->load([
        'municipality' => function($q) {
            $q->select('id', 'name', 'latitude', 'longitude');
        },
        'propertyType:id,name,description',
        'propertyStatus:id,name,color',
        'transactionType:id,name',
        'propertyCondition:id,name',
        'mortgagee' => function($q) {
            $q->select('id', 'name', 'contact_email', 'phone')
              ->where('is_active', true);
        }
    ]);

    return Inertia::render('Properties/Show', [
        'property' => $property,
        'similar' => Property::query()
            ->with('municipality:id,name')
            ->where('municipality_id', $property->municipality_id)
            ->where('property_type_id', $property->property_type_id)
            ->where('id', '!=', $property->id)
            ->select(['id', 'registry', 'sale_date', 'municipality_id'])
            ->limit(5)
            ->get()
    ]);
}
```

### 4. Transacciones Multi-Modelo (usa Service)

```php
// Service: PropertyImportService.php
public function importFromCSV(UploadedFile $file): ImportResult
{
    $errors = [];
    $imported = 0;

    DB::beginTransaction();

    try {
        $rows = Excel::toCollection(new PropertyImport, $file)->first();

        foreach ($rows as $index => $row) {
            try {
                // Validar que el municipio existe
                $municipality = Municipality::firstWhere('name', $row['municipio']);
                
                if (!$municipality) {
                    $errors[] = "Fila {$index}: Municipio '{$row['municipio']}' no existe";
                    continue;
                }

                // Crear property
                $property = Property::create([
                    'registry' => $row['registro'],
                    'deed_no' => $row['escritura'],
                    'sale_date' => Carbon::parse($row['fecha_venta']),
                    'municipality_id' => $municipality->id,
                    'area_sqr_meter' => $row['area_m2'],
                    'price_sqr_meter' => $row['precio_m2'],
                ]);

                // Geocodificar si hay dirección
                if (!empty($row['direccion'])) {
                    $coords = $this->geocodeService->geocode($row['direccion']);
                    $property->update([
                        'latitude' => $coords['lat'],
                        'longitude' => $coords['lng']
                    ]);
                }

                $imported++;

            } catch (\Exception $e) {
                $errors[] = "Fila {$index}: {$e->getMessage()}";
            }
        }

        DB::commit();

        return new ImportResult(
            success: true,
            imported: $imported,
            errors: $errors
        );

    } catch (\Exception $e) {
        DB::rollBack();
        throw new ImportException("Error en importación: {$e->getMessage()}");
    }
}
```

---

## Debugging Common Issues

### N+1 Query Problem

**❌ Síntoma:** Request tarda >2s, Laravel Debugbar muestra 100+ queries

```php
// Malo
$properties = Property::all();
foreach ($properties as $property) {
    echo $property->municipality->name;  // +1 query cada vez
}
```

**✅ Solución:** Eager loading

```php
// Bueno
$properties = Property::with('municipality')->get();
foreach ($properties as $property) {
    echo $property->municipality->name;  // Ya cargado
}
```

### Frontend recibe datos sensibles

**❌ Síntoma:** En DevTools ves `password`, `remember_token` en JSON

**✅ Solución 1:** Agregar a `$hidden` en Model

```php
// User.php
protected $hidden = [
    'password',
    'remember_token',
    'two_factor_secret',
];
```

**✅ Solución 2:** Usar `select()` explícito

```php
User::select(['id', 'name', 'email'])->get();
```

### Tests fallan con FK constraints

**❌ Síntoma:** `SQLSTATE[23000]: Integrity constraint violation`

**✅ Solución:** Crear relaciones con factories

```php
// Malo
Property::factory()->create(['municipality_id' => 999]);  // No existe

// Bueno
Property::factory()
    ->for(Municipality::factory())
    ->create();
```

---

## Performance Best Practices

### 1. Siempre usar `select()` en listados

```php
// ❌ Malo: trae 50 columnas que no usas
Property::with('municipality')->get();

// ✅ Bueno: solo 5 columnas necesarias
Property::with('municipality:id,name')
    ->select(['id', 'registry', 'municipality_id'])
    ->get();
```

### 2. Paginar listados grandes

```php
// ❌ Malo: trae 10,000 registros
Property::all();

// ✅ Bueno: 20 por página
Property::paginate(20);

// ✅ Mejor: cursor pagination para datasets muy grandes
Property::cursorPaginate(50);
```

### 3. Cachear datos estáticos

```php
// Municipios casi nunca cambian
$municipalities = Cache::remember('municipalities', 3600, function() {
    return Municipality::select('id', 'name')
        ->where('is_active', true)
        ->get();
});
```

### 4. Lazy loading solo cuando necesites

```php
// Si solo 10% de las veces necesitas mortgagee
$property = Property::find($id);

if ($request->has('include_mortgagee')) {
    $property->load('mortgagee:id,name,contact_email');
}
```

---

## TypeScript + Inertia Patterns

### Definir tipos para props de Inertia

```typescript
// types/index.ts
export interface Property {
  id: number;
  registry: string;
  deed_no: number;
  sale_date: string;
  municipality: Municipality;
  property_type: PropertyType;
}

export interface Municipality {
  id: number;
  name: string;
}

// pages/Properties/Index.tsx
import { Property } from '@/types';

interface Props {
  properties: {
    data: Property[];
    links: any;
    meta: any;
  };
  filters: {
    search?: string;
  };
}

export default function Index({ properties, filters }: Props) {
  // TypeScript sabe que properties.data es Property[]
}
```

---

## Comandos Útiles del Día a Día

```bash
# Regenerar todos los modelos tras cambios en DB
php artisan code:models

# Verificar rutas disponibles
php artisan route:list --columns=method,uri,name,action

# Limpiar todas las caches
php artisan optimize:clear

# Cachear todo para producción
php artisan optimize

# Ver queries SQL en tiempo real
php artisan db:monitor

# Ejecutar tests solo de PropertyController
php artisan test --filter=PropertyTest

# Formatear código automáticamente
./vendor/bin/pint

# Ver análisis estático
./vendor/bin/phpstan analyse app/

# Generar coverage report
php artisan test --coverage --min=80
```

---

## Recursos Externos

- [Laravel Eloquent Docs](https://laravel.com/docs/eloquent)
- [Inertia.js Guide](https://inertiajs.com/)
- [Reliese Laravel Repo](https://github.com/reliese/laravel)
- [Pest Testing Framework](https://pestphp.com/)

---

**Última actualización:** Octubre 2025  
**Mantenedores:** Equipo Tech de Comperia
