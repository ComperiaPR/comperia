<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePropertyStatusesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('property_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique()->comment('Nombre del estado de la propiedad');
            $table->string('slug')->unique()->comment('Slug del estado de la propiedad');
            $table->text('description')->nullable()->comment('Descripción del estado de la propiedad');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('property_statuses');
    }
}
