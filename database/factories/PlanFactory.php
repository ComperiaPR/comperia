<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Plan;

class PlanFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Plan::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'description' => fake()->text(),
            'price' => fake()->randomFloat(2, 0, 99999999.99),
            'days' => fake()->numberBetween(-10000, 10000),
            'type_plan' => fake()->regexify('[A-Za-z0-9]{20}'),
            'is_active' => fake()->boolean(),
        ];
    }
}
