<?php

namespace Database\Factories;

use App\Models\Municipality;
use Illuminate\Database\Eloquent\Factories\Factory;

class MunicipalityFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Municipality>
     */
    protected $model = Municipality::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->city(),
            'latitude' => (string) $this->faker->latitude(17.9, 18.6),
            'longitude' => (string) $this->faker->longitude(-67.3, -65.2),
            'is_active' => true,
        ];
    }
}
