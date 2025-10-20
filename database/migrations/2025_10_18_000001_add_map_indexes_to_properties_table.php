<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->index(['public_web', 'latitude', 'longitude'], 'idx_properties_public_coords');
            $table->index(['latitude', 'longitude'], 'idx_properties_lat_lng');
            $table->index('sale_date', 'idx_properties_sale_date');
            $table->index('price_sqr_meter', 'idx_properties_price_sqr_meter');
            $table->index('area_sqr_feet', 'idx_properties_area_sqr_feet');
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropIndex('idx_properties_public_coords');
            $table->dropIndex('idx_properties_lat_lng');
            $table->dropIndex('idx_properties_sale_date');
            $table->dropIndex('idx_properties_price_sqr_meter');
            $table->dropIndex('idx_properties_area_sqr_feet');
        });
    }
};
