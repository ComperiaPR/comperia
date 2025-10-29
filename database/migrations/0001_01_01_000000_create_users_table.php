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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email', 120)->unique()->comment('Email del usuario');
            $table->string('username', 120)->unique()->comment('Nombre de usuario');
            $table->string('document', 18)->nullable()->comment('Número de documento');
            $table->string('first_name', 125)->comment('Nombres');
            $table->string('last_name', 125)->comment('Apellidos');
            $table->string('company_name', 255)->nullable()->comment('Nombre de la empresa');
            $table->text('address_main')->comment('Dirección principal');
            $table->text('address_secondary')->nullable()->comment('Dirección secundaria');
            $table->foreignId('municipality_id')->constrained()->comment('Municipio del usuario');
            $table->string('zip_code', 10)->nullable()->comment('Código postal');
            $table->string('phone_number', 25)->nullable()->comment('Número de teléfono');
            $table->string('cell_number', 25)->nullable()->comment('Número de celular');
            $table->string('password', 255)->comment('Contraseña');
            $table->timestamp('email_verified_at')->nullable();
            $table->enum('account_type', ['personal', 'business'])->comment('Tipo de cuenta')->nullable();
            $table->boolean('terms')->default(true)->comment('Acepta los términos');
            $table->boolean('is_active')->default(true)->comment('Estado del usuario');
            $table->dateTime('date_start')->nullable()->comment('Fecha de inicio membresia');
            $table->dateTime('date_finish')->nullable()->comment('Fecha de fin membresia');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
