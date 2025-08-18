<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Property extends Model
{
	protected $fillable = [
		'daily',
		'page_entry',
		'track_no',
		'municipality_id',
		'property_status_id',
		'registry',
		'deed_no',
		'sale_date',
		'transaction_type_id',
		'notary',
		'seller',
		'resident_seller',
		'buyer',
		'resident_buyer',
		'development',
		'street',
		'unit_number',
		'ward',
		'sector',
		'road_kilometer',
		'zip_code',
		'cadastre',
		'property_type_id',
		'folio_page',
		'volumen',
		'inscription',
		'source',
		'remarks',
		'mortgagee_id',
		'mortgagee_amount',
		'interest_rate',
		'latitude',
		'longitude',
		'area_sqr_meter',
		'area_sqr_feet',
		'area_cuerdas',
		'price_sqr_meter',
		'price_sqr_feet',
		'price_cuerdas',
		'gla_sf',
		'gba_sf',
		'zoning',
		'flood_zone',
		'past_current_use',
		'property_condition_id',
		'public_web',
	];

	protected $casts = [
		'daily' => 'integer',
		'deed_no' => 'integer',
		'zip_code' => 'integer',
		'mortgagee_amount' => 'decimal:2',
		'interest_rate' => 'decimal:2',
		'area_sqr_meter' => 'decimal:4',
		'area_sqr_feet' => 'decimal:4',
		'area_cuerdas' => 'decimal:4',
		'price_sqr_meter' => 'decimal:4',
		'price_sqr_feet' => 'decimal:4',
		'price_cuerdas' => 'decimal:4',
		'public_web' => 'boolean',
		'sale_date' => 'datetime',
	];

	/**
	 * Scope para propiedades públicas en la web.
	 */
	public function scopePublicWeb(Builder $query)
	{
		return $query->where('public_web', true);
	}

	/**
	 * Relaciones
	 */
	public function municipality(): BelongsTo
	{
		return $this->belongsTo(Municipality::class);
	}

	public function propertyStatus(): BelongsTo
	{
		return $this->belongsTo(PropertyStatus::class);
	}

	public function transactionType(): BelongsTo
	{
		return $this->belongsTo(TransationType::class);
	}

	public function propertyType(): BelongsTo
	{
		return $this->belongsTo(PropertyType::class);
	}

	public function mortgagee(): BelongsTo
	{
		return $this->belongsTo(Mortgagee::class);
	}

	public function propertyCondition(): BelongsTo
	{
		return $this->belongsTo(PropertyCondition::class);
	}
}