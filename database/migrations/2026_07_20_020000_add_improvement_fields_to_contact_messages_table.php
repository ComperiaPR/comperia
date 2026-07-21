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
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->string('type')->default('contact')->after('user_id')->comment('contact | improvement');
            $table->foreignId('property_id')->nullable()->after('type')->constrained()->nullOnDelete();
            $table->string('improvement_type')->nullable()->after('property_id')->comment('Ver App\\Enums\\PropertyImprovementTypeEnum');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropConstrainedForeignId('property_id');
            $table->dropColumn(['type', 'improvement_type']);
        });
    }
};
