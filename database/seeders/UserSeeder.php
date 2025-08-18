<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
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
    }
}
