<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\User;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        $user = User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'terms' => true,
            'is_active' => true,
            'municipality_id' => 1,
            'address_main' => 'User devs',
            'email' => 'odespitia@gmail.com',
            'username' => 'odespitia@gmail.com',
            'password' => bcrypt('Odem123*'),
        ]);

        $user->assignRole('admin');

        return $user;
    }
}
