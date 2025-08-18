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
        Schema::create('municipalities', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255)->unique()->comment('Nombre del municipio');
            $table->string('latitude', 20)->comment('Latitud del municipio');
            $table->string('longitude', 20)->comment('Longitud del municipio');
            $table->boolean('is_active')->default(true)->comment('Estado del municipio');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('municipalities');
    }
};
