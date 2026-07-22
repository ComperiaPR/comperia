<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_payments', function (Blueprint $table) {
            // varchar(45) — holds IPv4 and IPv6
            $table->ipAddress('ip')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('user_payments', function (Blueprint $table) {
            $table->string('ip', 20)->nullable()->change();
        });
    }
};
