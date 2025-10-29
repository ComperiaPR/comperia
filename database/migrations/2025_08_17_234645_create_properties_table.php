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
            $table->integer('daily')->nullable()->comment('Daily');
            $table->string('page_entry', 12)->nullable()->comment('Page Entry');
            $table->string('track_no', 12)->nullable()->comment('Track No.');
            $table->foreignId('municipality_id')->constrained('municipalities')->comment('Municipio al que pertenece la propiedad');
            $table->foreignId('property_status_id')->constrained('property_statuses')->comment('Estado de la propiedad');
            $table->string('registry', 180)->nullable()->comment('Registry');
            $table->integer('deed_no')->nullable()->comment('Deed No.');
            $table->dateTime('sale_date')->nullable()->comment('Fecha de venta');
            $table->foreignId('transaction_type_id')->constrained('transaction_types')->comment('Tipo de transacción');
            $table->string('notary', 255)->nullable()->comment('Notario');
            $table->string('seller', 255)->nullable()->comment('Vendedor');
            $table->string('resident_seller', 255)->nullable()->comment('Dirección Vendedor');
            $table->string('buyer', 255)->nullable()->comment('Comprador');
            $table->string('resident_buyer', 255)->nullable()->comment('Dirección Comprador');
            $table->string('development', 255)->nullable()->comment('Desarrollo');
            $table->string('street', 255)->nullable()->comment('Calle');
            $table->string('unit_number', 100)->nullable()->comment('Unit Number (Número)');
            $table->string('ward', 100)->nullable()->comment('Barrio');
            $table->string('sector', 100)->nullable()->comment('Sector');
            $table->string('road_kilometer', 255)->nullable()->comment('Road / Kilometer');
            $table->string('zip_code')->nullable()->comment('Código Postal');
            $table->string('cadastre', 150)->nullable()->comment('Catastro');
            $table->foreignId('property_type_id')->constrained('property_types')->comment('Tipo de propiedad');
            $table->char('folio_page', 10)->nullable()->comment('Page (Folio)');
            $table->string('volumen', 20)->nullable()->comment('Volumen');
            $table->string('inscription', 20)->nullable()->comment('Inscription');
            $table->text('source')->nullable()->comment('Source');
            $table->text('remarks')->nullable()->comment('Remarks');
            $table->foreignId('mortgagee_id')->nullable()->constrained('mortgagees')->comment('Mortgagee - Acreedor hipotecario');
            $table->decimal('mortgagee_amount', 16,2)->nullable()->comment('Monto del acreedor hipotecario');
            $table->decimal('interest_rate', 8,2)->nullable()->comment('Interest Rate %');
            $table->string('latitude', 20)->nullable()->comment('Latitud de la propiedad');
            $table->string('longitude', 20)->nullable()->comment('Longitud de la propiedad');
            $table->decimal('area_sqr_meter', 16,4)->nullable()->comment('Área en metros cuadrados');
            $table->decimal('area_sqr_feet', 16,4)->nullable()->comment('Área en pies cuadrados');
            $table->decimal('area_cuerdas', 16,4)->nullable()->comment('Área en cuerdas');
            $table->decimal('price', 16,4)->nullable()->comment('Precio de la propiedad');
            $table->decimal('price_sqr_meter', 16,4)->nullable()->comment('Precio por metro cuadrado');
            $table->decimal('price_sqr_feet', 16,4)->nullable()->comment('Precio por pie cuadrado');
            $table->decimal('price_cuerdas', 16,4)->nullable()->comment('Precio por cuerdas');
            $table->string('gla_sf', 255)->nullable()->comment('GLA +/- SF');
            $table->string('gba_sf', 255)->nullable()->comment('GLA +/- SF');
            $table->string('zoning', 255)->nullable()->comment('Zoning');
            $table->string('flood_zone', 255)->nullable()->comment('Flood Zone');
            $table->string('past_current_use', 255)->nullable()->comment('Property Past Current Use');
            $table->foreignId('property_condition_id')->nullable()->constrained('property_conditions')->comment('Property Condition');
            $table->boolean('public_web')->default(false)->comment('Public Web');

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
