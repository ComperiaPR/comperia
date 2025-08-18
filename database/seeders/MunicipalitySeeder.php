<?php

namespace Database\Seeders;

use App\Models\Municipality;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MunicipalitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $municipality = Municipality::create([
            'name' => 'Municipio Ejemplo',
            'is_active' => true,
            'latitude' => 18.4861,
            'longitude' => -69.9312
        ],[
            'name' => 'Municipio Ejemplo 2',
            'is_active' => true,
            'latitude' => 18.4861,
            'longitude' => -69.9312
        ]);
    }
}

