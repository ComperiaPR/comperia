<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mortgagee;

class MortgageeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Mortgagee::insert([
            ['name' => ' Others', 'is_active' => true],
            ['name' => 'Banco Popular de P.R.', 'is_active' => true],
            ['name' => 'USDA Farm Service Agency', 'is_active' => true],
            ['name' => 'Firstbank', 'is_active' => true],
            ['name' => 'Oriental Bank', 'is_active' => true],
            ['name' => 'BBVA', 'is_active' => true],
            ['name' => 'Banco Santander de P.R.', 'is_active' => true],
            ['name' => 'Westerbank', 'is_active' => true],
            ['name' => 'Eurobank', 'is_active' => true],
            ['name' => 'RG Bank', 'is_active' => true],
            ['name' => 'Scotiabank', 'is_active' => true],
            ['name' => 'Cooperativa', 'is_active' => true],
            ['name' => 'BDE para P.R.', 'is_active' => true],
            ['name' => 'Sun West', 'is_active' => true],
            ['name' => 'Cash Sale', 'is_active' => true],
            ['name' => 'AEELA', 'is_active' => true],
            ['name' => 'By Seller', 'is_active' => true],
            ['name' => 'PR Farm Credit', 'is_active' => true],
            ['name' => 'USDA Rural Dev.', 'is_active' => true],
            ['name' => ' N/A', 'is_active' => true],
        ]);
    }
}
