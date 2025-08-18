<?php

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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255)->unique()->comment('Nombre del plan');
            $table->text('description')->comment('Descripción del plan');
            $table->decimal('price', 10, 2)->comment('Precio del plan');
            $table->integer('days')->comment('Días de duración del plan');
            $table->string('type_plan', 20)->comment('Tipo de plan');
            $table->boolean('is_active')->default(true)->comment('Estado del plan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
