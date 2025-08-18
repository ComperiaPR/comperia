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
        Schema::disableForeignKeyConstraints();

        Schema::create('user_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->comment('ID del usuario que realiza el pago');
            $table->foreignId('plan_id')->constrained()->comment('ID del plan adquirido');
            $table->foreignId('payment_type_id')->constrained()->comment('ID del tipo de pago');
            $table->string('ip', 20)->comment('IP del usuario');
            $table->dateTime('date_start')->comment('Fecha de inicio de la membresia');
            $table->dateTime('date_finish')->comment('Fecha de fin de la membresia');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_payments');
    }
};
