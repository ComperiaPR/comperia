<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PropertyCondition;

class PropertyConditionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PropertyCondition::insert([
            ['name' => 'Good', 'is_active' => true],
            ['name' => 'Average', 'is_active' => true],
            ['name' => 'Fair', 'is_active' => true],
            ['name' => 'Poor', 'is_active' => true],
            ['name' => ' N/A', 'is_active' => true],
        ]);
    }
}
