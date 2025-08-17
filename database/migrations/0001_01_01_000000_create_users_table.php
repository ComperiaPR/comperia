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
            $table->string('email', 255)->unique();
            $table->string('username', 255)->unique();
            $table->string('document', 12)->nullable();
            $table->string('first_name', 125);
            $table->string('last_name', 125);
            $table->string('company_name', 255)->nullable();
            $table->text('address_main');
            $table->text('address_secondary')->nullable();
            $table->string('zip_code', 10)->nullable();
            $table->string('password', 255);
            $table->timestamp('email_verified_at')->nullable();
            $table->boolean('terms');
            $table->boolean('is_active');
            $table->dateTime('date_start')->nullable();
            $table->dateTime('date_finish')->nullable();
            $table->foreignId('municipality_id')->constrained();
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
