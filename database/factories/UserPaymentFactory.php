<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\PaymentType;
use App\Models\Plan;
use App\Models\User;
use App\Models\UserPayment;

class UserPaymentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = UserPayment::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'plan_id' => Plan::factory(),
            'payment_type_id' => PaymentType::factory(),
            'ip' => fake()->regexify('[A-Za-z0-9]{20}'),
            'date_start' => fake()->dateTime(),
            'date_finish' => fake()->dateTime(),
        ];
    }
}
