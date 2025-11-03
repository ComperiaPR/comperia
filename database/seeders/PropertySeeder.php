<?php

namespace Database\Seeders;

use App\Models\Property;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonFilePath = database_path('seeders/json/properties_data.json');
        
        if (!file_exists($jsonFilePath)) {
            $this->command->error("File not found: {$jsonFilePath}");
            return;
        }

        $data = json_decode(file_get_contents($jsonFilePath), true);
        $properties = $data['properties'] ?? [];

        $fillable = (new Property())->getFillable();
        
        foreach ($properties as $property) {
            try {
                $filteredProperty = array_intersect_key($property, array_flip($fillable));
                Property::create($filteredProperty);
            } catch (\Exception $e) {
                // Continuar con el siguiente
            }
        }

        $this->command->info("Seeded " . count($properties) . " properties.");
    }
}
