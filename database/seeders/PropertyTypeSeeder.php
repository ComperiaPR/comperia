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
            ['name' => 'Recreational', 'is_active' => true, 'type' => 1],
            ['name' => 'Agriculture', 'is_active' => true, 'type' => 1],
            ['name' => 'Land-Conservation', 'is_active' => true, 'type' => 1],
            ['name' => 'Land', 'is_active' => true, 'type' => 1],
            ['name' => 'Car Dealer / Service', 'is_active' => true, 'type' => 1],
            ['name' => 'Restaurant / F.Food', 'is_active' => true, 'type' => 1],
            ['name' => 'Gas Station', 'is_active' => true, 'type' => 1],
            ['name' => 'Health Care', 'is_active' => true, 'type' => 1],
            ['name' => 'Historic Commercial', 'is_active' => true, 'type' => 1],
            ['name' => 'Hotel / Motel', 'is_active' => true, 'type' => 1],
            ['name' => 'Income Property', 'is_active' => true, 'type' => 1],
            ['name' => 'Mixed-Use Bldg.', 'is_active' => true, 'type' => 1],
            ['name' => 'Office Space', 'is_active' => true, 'type' => 1],
            ['name' => 'Commercial Condo / Space', 'is_active' => true, 'type' => 1],
            ['name' => ' Other', 'is_active' => true, 'type' => 1],
            ['name' => 'Parking Bldg.', 'is_active' => true, 'type' => 1],
            ['name' => 'Retail', 'is_active' => true, 'type' => 1],
            ['name' => 'Land With Structure', 'is_active' => true, 'type' => 1],
            ['name' => 'Shopping Center / Mall', 'is_active' => true, 'type' => 1],
            ['name' => 'Urb. / Condo. Development', 'is_active' => true, 'type' => 1],
            ['name' => 'Warehouse / Industrial', 'is_active' => true, 'type' => 1],
            ['name' => 'Wooden Commercial', 'is_active' => true, 'type' => 1],
            ['name' => 'Apartment unit', 'is_active' => true, 'type' => 1],
            ['name' => 'Attached Res.', 'is_active' => true, 'type' => 1],
            ['name' => 'Detached Res.', 'is_active' => true, 'type' => 1],
            ['name' => 'Historic Res.', 'is_active' => true, 'type' => 1],
            ['name' => 'Multifamily 2-4 units', 'is_active' => true, 'type' => 1],
            ['name' => 'Multifamily 5-up units', 'is_active' => true, 'type' => 1],
            ['name' => 'Penthouse', 'is_active' => true, 'type' => 1],
            ['name' => 'Walk-up', 'is_active' => true, 'type' => 1],
            ['name' => 'Wooden Res.', 'is_active' => true, 'type' => 1],
            ['name' => 'Office Building', 'is_active' => true, 'type' => 1],
            ['name' => 'Commercial', 'is_active' => true, 'type' => 1],
            ['name' => 'Parking Space', 'is_active' => true, 'type' => 1],
            ['name' => 'Res. in Comm. Area', 'is_active' => true, 'type' => 1],
            ['name' => 'Institutional', 'is_active' => true, 'type' => 1],
            ['name' => 'Guest House', 'is_active' => true, 'type' => 1],
            ['name' => 'Bank Branch', 'is_active' => true, 'type' => 1],
        ]);
    }
}
