<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TransactionType;

class TransactionTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TransactionType::insert([
            ['name' => ' All Transactions', 'is_active' => true],
            ['name' => 'Purchase and Sale', 'is_active' => true],
            ['name' => 'Foreclosure', 'is_active' => true],
            ['name' => 'REO', 'is_active' => true],
            ['name' => 'Notice of Default', 'is_active' => true],
            ['name' => 'Deed of Transfer (Dacion en Pago)', 'is_active' => true],
            ['name' => 'Mortgage', 'is_active' => true],
            ['name' => 'Lease', 'is_active' => true],
            ['name' => 'Expropriation', 'is_active' => true],
            ['name' => 'Internal Sale', 'is_active' => true],
            ['name' => 'Intra-Family Sale', 'is_active' => true],
            ['name' => ' Other', 'is_active' => true],
            ['name' => 'Donation', 'is_active' => true],
            ['name' => 'Transfer (Permuta)', 'is_active' => true],
            ['name' => 'Inheritance (Herencia)', 'is_active' => true],
            ['name' => 'Transfer (Cesion)', 'is_active' => true],
            ['name' => 'Segregation', 'is_active' => true],
            ['name' => 'Purchase of Participation', 'is_active' => true],
        ]);
    }
}
