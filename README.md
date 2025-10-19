# Comperia

Comperia es una plataforma de consulta y seguimiento de inmuebles que permite a las empresas consultar diferente información de inmuebles en Puerto Rico.

## Características

- Registro de propiedades/inmuebles con datos catastrales completos
- Consulta avanzada de propiedades con filtros y geolocalización
- Historial de transacciones inmobiliarias
- Sistema de usuarios con roles y permisos (Spatie Permission)
- Gestión de pagos y suscripciones
- API REST con Inertia.js para SPA

## Tecnologías Utilizadas

- **Frontend:** React (v19), TypeScript (v5), Inertia.js (v2), Tailwind CSS (v4)
- **Backend:** PHP (v8.3), Laravel (v12)
- **Base de datos:** MySQL (v8)
- **Herramientas:** Docker, Pest (testing), Pint (formatting), PHPStan (static analysis)

## Instalación local con Docker

Para obtener una copia local en funcionamiento, siga estos pasos:

### Requisitos Previos
- Docker (v20+) y Docker Compose (v2+)
- Git configurado con acceso al repositorio

### Configuración

1. **Clonar el repositorio:**
    ```bash
    git clone git@github.com:ComperiaPR/comperia.git
    cd comperia
    ```

2. **Configurar credenciales Git (dentro del proyecto):**
    ```bash
    git config user.email tu-email@example.com
    git config user.name "Tu Nombre"
    git config core.fileMode false
    ```

3. **Configurar variables de entorno:**
    ```bash
    cp .env.example .env
    # Editar .env con tus credenciales de base de datos si es necesario
    ```

4. **Levantar contenedores:**
    ```bash
    docker-compose up -d
    ```

5. **Instalar dependencias y configurar la aplicación:**
    
    Ingresar al contenedor:
    ```bash
    docker exec -it comperia-comperia-1 bash
    ```
    
    Dentro del contenedor:
    ```bash
    composer install
    npm install
    php artisan key:generate
    php artisan migrate --seed
    php artisan storage:link
    php artisan db:seed --class=RolesAndPermissionsSeeder
    ```

6. **Iniciar servidor de desarrollo:**
    
    Dentro del contenedor:
    ```bash
    npm run dev
    ```
    
    O desde fuera:
    ```bash
    docker exec -it comperia-comperia-1 bash -c "npm run dev"
    ```

7. **Acceder a la aplicación:**
    - Frontend: `http://localhost` (puerto configurado en `.env` como `APP_PORT`, default 80)
    - Vite HMR: `http://localhost:5173`
    - Mailpit: `http://localhost:8025`
    - MySQL: `localhost:3306`

## Arquitectura y Estándares de Desarrollo

### Filosofía: pragmatismo sobre patrones

Este proyecto adopta una arquitectura pragmática que evita el sobre-ingeniería común en aplicaciones Laravel. Prioriza:

1. **Velocidad de desarrollo** sobre abstracciones complejas
2. **Mantenibilidad** con herramientas estándar de Laravel
3. Código legible sobre patrones empresariales

### Decisión arquitectónica: no utilizar DTOs ni API Resources en nuevos desarrollos

Contexto histórico del proyecto

El código heredado incluye DTOs (`app/DTOs/`) y Resources (`app/Http/Resources/`), pero se encuentran en proceso de deprecación por las siguientes razones:

Problemas identificados con DTOs/Resources

1. Sobrecarga de desarrollo
   - Crear DTO → escribir properties → método `fromArray()` → mapear en Repository/Service
   - Crear Resource → definir campos → transformar data → sincronizar con frontend
   - **Resultado:** 3-4 archivos extra por cada entidad

2. Rigidez de contratos
   - Cambio en DB → migración → modelo → DTO → Resource → TypeScript interface
   - **Cadena frágil** que rompe fácilmente con cambios de esquema

3. Confusión en el equipo
   - "¿Uso `PropertyDTO` o `PropertyResource`?"
   - "¿Por qué el DTO tiene campos diferentes al Resource?"
   - Inconsistencias entre capas generan bugs sutiles

Enfoque recomendado: FormRequest de Laravel y Eloquent con eager loading

Nuevo estándar (más rápido y escalable)

```php
// 1. Generar modelo desde DB (auto-genera properties, casts, relations)
php artisan code:models --table=properties

// 2. Crear FormRequest para validación
php artisan make:request PropertyStoreRequest

// 3. En el Controller, usar Eloquent directamente con eager loading selectivo
public function index()
{
    $properties = Property::query()
        ->with([
            'municipality:id,name',  // Solo campos necesarios
            'propertyType:id,name',
            'propertyStatus:id,name,color',
            'transactionType' => function($q) {
                $q->select('id', 'name', 'description')
                  ->where('is_active', true);
            }
        ])
        ->select([
            'id', 'registry', 'deed_no', 'sale_date', 
            'price_sqr_meter', 'area_sqr_meter',
            'municipality_id', 'property_type_id', 
            'property_status_id', 'transaction_type_id'
        ])
        ->when(request('search'), function($q, $search) {
            $q->where('registry', 'like', "%{$search}%")
              ->orWhere('deed_no', $search);
        })
        ->paginate(20);

    return Inertia::render('Properties/Index', [
        'properties' => $properties
    ]);
}

// 4. En TypeScript, usar los tipos auto-generados por Ziggy
interface Property {
  id: number;
  registry: string;
  // Laravel envía exactamente lo que pediste en select()
}
```

Ventajas del enfoque propuesto

- Menos archivos: Request + Controller (en lugar de Request + DTO + Resource + Service + Repository)
- Flexibilidad: permite ajustar `with()` y `select()` sin modificar otras capas
- Rendimiento: control detallado de N+1 queries mediante eager loading
- Consistencia: el frontend recibe exactamente lo que el Controller expone
- Depuración: pila de llamadas más corta (Controller → Model → DB)

### Comandos Artisan Clave para Desarrollo Rápido

#### 1. Generar modelos desde base de datos existente

```bash
# Generar TODOS los modelos del schema actual
php artisan code:models

# Generar modelo de una tabla específica
php artisan code:models --table=properties

# Regenerar forzando sobreescritura (cuidado con customizaciones)
php artisan code:models --table=users --force
```

Elementos generados automáticamente por Reliese
- ✅ Properties con tipos (PHPDoc)
- ✅ Casts automáticos (`'sale_date' => 'datetime'`)
- ✅ `$fillable` con todas las columnas
- ✅ Relaciones `belongsTo`, `hasMany`, `belongsToMany` (detecta FKs)
- ✅ Hidden fields (`password`, `remember_token`)

Importante: si se configura `--base_files => true` en `config/models.php`:
- Se crean `BaseProperty` (generado) + `Property` (tu código)
- Puedes regenerar sin perder tus métodos custom

#### 2. Crear FormRequests para validación

```bash
# Request básico
php artisan make:request PropertyStoreRequest

# Request con reglas más complejas
php artisan make:request PropertyUpdateRequest
```

Ejemplo de FormRequest

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
            'area_sqr_meter' => ['nullable', 'numeric', 'min:0'],
            'price_sqr_meter' => ['nullable', 'numeric', 'min:0'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ];
    }

    public function messages(): array
    {
        return [
            'municipality_id.exists' => 'El municipio seleccionado no es válido.',
            'deed_no.integer' => 'El número de escritura debe ser un número entero.',
        ];
    }
}
```

Uso en el Controller

```php
public function store(PropertyStoreRequest $request)
{
    // $request->validated() ya tiene data limpia y validada
    $property = Property::create($request->validated());

    return redirect()
        ->route('properties.show', $property)
        ->with('success', 'Propiedad creada exitosamente');
}
```

#### 3. Eloquent Eager Loading: Evitar N+1 Queries

Caso no recomendado (problema de N+1 consultas)

```php
$properties = Property::all(); // 1 query

foreach ($properties as $property) {
    echo $property->municipality->name;  // +1 query por cada property
    echo $property->propertyType->name;  // +1 query por cada property
}
// Total: 1 + (N * 2) queries 
```

Caso recomendado (eager loading)

```php
$properties = Property::with('municipality', 'propertyType')->get(); // 3 queries

foreach ($properties as $property) {
    echo $property->municipality->name;  // Ya cargado en memoria
    echo $property->propertyType->name;  // Ya cargado en memoria
}
// Total: 3 queries 
```

Caso preferible (eager loading selectivo)

```php
$properties = Property::query()
    ->with([
        'municipality:id,name',           // Solo id y name
        'propertyType:id,name',
        'transactionType:id,name',
        'mortgagee' => function($query) {
            $query->select('id', 'name', 'contact_email')
                  ->where('is_active', true);
        }
    ])
    ->select([  // Solo campos necesarios de properties
        'id', 'registry', 'deed_no', 'municipality_id',
        'property_type_id', 'transaction_type_id', 'mortgagee_id'
    ])
    ->get();

// Total: 5 queries, pero con data mínima = súper rápido 🔥
```

Caso de uso: endpoint con relaciones anidadas

```php
// GET /api/properties?include=municipality,propertyType,transactionType
public function index(Request $request)
{
    $includes = explode(',', $request->query('include', ''));

    $query = Property::query()->select([
        'id', 'registry', 'deed_no', 'sale_date', 'municipality_id'
    ]);

    // Eager load dinámico basado en query param
    if (in_array('municipality', $includes)) {
        $query->with('municipality:id,name,latitude,longitude');
    }

    if (in_array('propertyType', $includes)) {
        $query->with('propertyType:id,name');
    }

    if (in_array('transactionType', $includes)) {
        $query->with('transactionType:id,name,description');
    }

    return Inertia::render('Properties/Index', [
        'properties' => $query->paginate(20)
    ]);
}
```

### Patrón Repository/Service: ¿Cuándo usar?

Cuándo no utilizar Repository/Service
- CRUDs simples (Property con solo `municipality_id`)
- Endpoints que solo leen/filtran data
- Operaciones que Laravel ya simplifica (`$model->update($request->validated())`)

Cuándo utilizar Repository/Service
- Lógica de negocio compleja (cálculos, validaciones multi-modelo)
- Transacciones que afectan múltiples tablas
- Operaciones que necesitas reutilizar en Commands/Jobs/Listeners

**Ejemplo de cuando SÍ vale la pena:**

```php
// PropertyService.php - Lógica compleja de importación desde CSV
class PropertyService
{
    public function importFromCSV(UploadedFile $file): ImportResult
    {
        DB::beginTransaction();
        
        try {
            $rows = Excel::toCollection(new PropertyImport, $file)->first();
            
            foreach ($rows as $row) {
                // Validar + crear municipality si no existe
                $municipality = $this->findOrCreateMunicipality($row['municipio']);
                
                // Calcular precio por metro cuadrado
                $pricePerSqm = $this->calculatePricePerSqm($row['price'], $row['area']);
                
                // Geocodificar dirección
                $coordinates = $this->geocode($row['address']);
                
                Property::create([
                    'registry' => $row['registro'],
                    'municipality_id' => $municipality->id,
                    'price_sqr_meter' => $pricePerSqm,
                    'latitude' => $coordinates['lat'],
                    'longitude' => $coordinates['lng'],
                ]);
            }
            
            DB::commit();
            return new ImportResult(success: true, count: $rows->count());
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
```

### Estructura de Carpetas Recomendada

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── PropertyController.php      # CRUD simple
│   │   └── PropertyImportController.php # Usa Service
│   └── Requests/
│       ├── PropertyStoreRequest.php
│       └── PropertyUpdateRequest.php
├── Models/
│   └── Property.php                    # Generado con code:models
├── Services/
│   └── PropertyImportService.php       # Solo para lógica compleja
└── DTOs/                               # LEGACY - No crear nuevos
    └── PropertyCreateDTO.php
```

### Testing con Factories

```bash
# Generar factory
php artisan make:factory PropertyFactory
```

```php
// PropertyFactory.php
public function definition(): array
{
    return [
        'registry' => $this->faker->numerify('REG-####'),
        'deed_no' => $this->faker->randomNumber(6),
        'sale_date' => $this->faker->dateTimeBetween('-2 years'),
        'municipality_id' => Municipality::factory(),  // FK automática
        'property_type_id' => PropertyType::factory(),
        'area_sqr_meter' => $this->faker->randomFloat(2, 50, 500),
    ];
}
```

```php
// PropertyTest.php
test('can create property with relations', function () {
    $property = Property::factory()
        ->for(Municipality::factory()->state(['name' => 'San Juan']))
        ->for(PropertyType::factory()->state(['name' => 'Residential']))
        ->create();

    expect($property->municipality->name)->toBe('San Juan')
        ->and($property->propertyType->name)->toBe('Residential');
});
```

## Calidad de Código y Testing

### Estándares

- **PHP:** PSR-12 (Laravel style)
- **JavaScript/TypeScript:** Airbnb style guide
- **Commits:** Conventional Commits

### Estructura de Commits

```
<tipo>: <título conciso en presente>

- Descripción del cambio 1
- Por qué se hizo este cambio
- Impacto en otras partes del sistema (si aplica)

<referencias a issues/PRs si existen>
```

Tipos permitidos
- `feat`: nueva funcionalidad
- `fix`: corrección de bug
- `refactor`: cambio de código sin alterar funcionalidad
- `docs`: cambios en documentación
- `test`: añadir/modificar tests
- `chore`: cambios en build, deps, config

Ejemplo de commit

```
feat: añadir eager loading selectivo en PropertyController

- Implementar with() con select para reducir queries N+1
- Optimizar carga de municipality, propertyType, transactionType
- Reducir payload de API de ~2MB a ~200KB en listado

Cerrado #123
```

### Comandos de Calidad

Antes de cada commit, se recomienda ejecutar

1. **Tests (obligatorio):**
   ```bash
   php artisan test
   # O con coverage:
   php artisan test --coverage
   ```

2. **Linter y formateo (auto-fix):**
   ```bash
   # Check sin modificar
   ./vendor/bin/pint --test
   
   # Fix automático
   ./vendor/bin/pint
   ```

3. **Static Analysis (recomendado):**
   ```bash
   ./vendor/bin/phpstan analyse --level=6
   
   # O con Laravel Insights:
   php artisan insights
   ```

4. **Actualización automática a nuevas versiones de PHP (opcional):**
   ```bash
   # Dry-run (ver qué cambiaría)
   ./vendor/bin/rector --dry-run
   
   # Aplicar cambios
   ./vendor/bin/rector
   ```