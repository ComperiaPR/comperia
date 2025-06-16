<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable()->comment('Nombre de la propiedad asignado por el usuario');
            $table->string('address')->nullable()->comment('Dirección de la propiedad');
            $table->string('description')->nullable()->comment('Descripción de la propiedad');
            $table->boolean('is_active')->default(true)->comment('Estado de la propiedad');
            $table->foreignId('user_id')->constrained()->comment('Usuario que creó la propiedad');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
