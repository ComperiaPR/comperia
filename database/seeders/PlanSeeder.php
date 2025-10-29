<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Plan;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Plan::insert([
            [
                'name' => 'Monthly',
                'description' => 'Cost Monthly',
                'price' => 125.00,
                'days' => 30,
                'type_plan' => '1',
                'is_active' => false,
            ],
            [
                'name' => 'Quarterly',
                'description' => 'Cost Quarterly',
                'price' => 375.00,
                'days' => 90,
                'type_plan' => '1',
                'is_active' => false,
            ],
            [
                'name' => 'Biannual',
                'description' => 'Cost Biannual',
                'price' => 750.00,
                'days' => 180,
                'type_plan' => '1',
                'is_active' => false,
            ],
            [
                'name' => 'Annual',
                'description' => 'Cost Annual',
                'price' => 1500.00,
                'days' => 365,
                'type_plan' => '1',
                'is_active' => false,
            ],
        ]);
    }
}
