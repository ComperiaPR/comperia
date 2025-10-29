<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PropertyType;

class PropertyTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PropertyType::insert([
            ['name' => 'Recreational', 'is_active' => true],
            ['name' => 'Agriculture', 'is_active' => true],
            ['name' => 'Land-Conservation', 'is_active' => true],
            ['name' => 'Land', 'is_active' => true],
            ['name' => 'Car Dealer / Service', 'is_active' => true],
            ['name' => 'Restaurant / F.Food', 'is_active' => true],
            ['name' => 'Gas Station', 'is_active' => true],
            ['name' => 'Health Care', 'is_active' => true],
            ['name' => 'Historic Commercial', 'is_active' => true],
            ['name' => 'Hotel / Motel', 'is_active' => true],
            ['name' => 'Income Property', 'is_active' => true],
            ['name' => 'Mixed-Use Bldg.', 'is_active' => true],
            ['name' => 'Office Space', 'is_active' => true],
            ['name' => 'Commercial Condo / Space', 'is_active' => true],
            ['name' => ' Other', 'is_active' => true],
            ['name' => 'Parking Bldg.', 'is_active' => true],
            ['name' => 'Retail', 'is_active' => true],
            ['name' => 'Land With Structure', 'is_active' => true],
            ['name' => 'Shopping Center / Mall', 'is_active' => true],
            ['name' => 'Urb. / Condo. Development', 'is_active' => true],
            ['name' => 'Warehouse / Industrial', 'is_active' => true],
            ['name' => 'Wooden Commercial', 'is_active' => true],
            ['name' => 'Apartment unit', 'is_active' => true],
            ['name' => 'Attached Res.', 'is_active' => true],
            ['name' => 'Detached Res.', 'is_active' => true],
            ['name' => 'Historic Res.', 'is_active' => true],
            ['name' => 'Multifamily 2-4 units', 'is_active' => true],
            ['name' => 'Multifamily 5-up units', 'is_active' => true],
            ['name' => 'Penthouse', 'is_active' => true],
            ['name' => 'Walk-up', 'is_active' => true],
            ['name' => 'Wooden Res.', 'is_active' => true],
            ['name' => 'Office Building', 'is_active' => true],
            ['name' => 'Commercial', 'is_active' => true],
            ['name' => 'Parking Space', 'is_active' => true],
            ['name' => 'Res. in Comm. Area', 'is_active' => true],
            ['name' => 'Institutional', 'is_active' => true],
            ['name' => 'Guest House', 'is_active' => true],
            ['name' => 'Bank Branch', 'is_active' => true],
        ]);
    }
}
