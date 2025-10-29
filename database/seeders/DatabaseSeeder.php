<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            MunicipalitySeeder::class,
            PropertyTypeSeeder::class,
            TransactionTypeSeeder::class,
            MortgageeSeeder::class,
            PropertyStatusSeeder::class,
            PropertyConditionSeeder::class,
            PlanSeeder::class,
            RolesAndPermissionsSeeder::class,
            UserSeeder::class,
        ]);
    }
}
