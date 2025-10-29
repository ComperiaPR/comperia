<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PropertyStatus;

class PropertyStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PropertyStatus::insert([
            [
                'name' => 'Activo',
                'slug' => 'activo',
                'description' => 'Propiedad activa y disponible para transacciones',
            ],
            [
                'name' => 'Inactivo',
                'slug' => 'inactivo',
                'description' => 'Propiedad inactiva o fuera del mercado',
            ],
            [
                'name' => 'No disponible',
                'slug' => 'no-disponible',
                'description' => 'Propiedad no disponible para transacciones',
            ],
        ]);
    }
}
