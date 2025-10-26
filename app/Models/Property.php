<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;

/**
 * Class Property
 * 
 * @property int $id
 * @property int|null $daily
 * @property string|null $page_entry
 * @property string|null $track_no
 * @property int $municipality_id
 * @property int $property_status_id
 * @property string|null $registry
 * @property int|null $deed_no
 * @property Carbon|null $sale_date
 * @property int $transaction_type_id
 * @property string|null $notary
 * @property string|null $seller
 * @property string|null $resident_seller
 * @property string|null $buyer
 * @property string|null $resident_buyer
 * @property string|null $development
 * @property string|null $street
 * @property string|null $unit_number
 * @property string|null $ward
 * @property string|null $sector
 * @property string|null $road_kilometer
 * @property int|null $zip_code
 * @property string|null $cadastre
 * @property int $property_type_id
 * @property string|null $folio_page
 * @property string|null $volumen
 * @property string|null $inscription
 * @property string|null $source
 * @property string|null $remarks
 * @property int $mortgagee_id
 * @property float|null $mortgagee_amount
 * @property float|null $interest_rate
 * @property string|null $latitude
 * @property string|null $longitude
 * @property float|null $area_sqr_meter
 * @property float|null $area_sqr_feet
 * @property float|null $area_cuerdas
 * @property float|null $price_sqr_meter
 * @property float|null $price_sqr_feet
 * @property float|null $price_cuerdas
 * @property string|null $gla_sf
 * @property string|null $gba_sf
 * @property string|null $zoning
 * @property string|null $flood_zone
 * @property string|null $past_current_use
 * @property int $property_condition_id
 * @property bool $public_web
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Mortgagee $mortgagee
 * @property Municipality $municipality
 * @property PropertyCondition $property_condition
 * @property PropertyStatus $property_status
 * @property PropertyType $property_type
 * @property TransactionType $transaction_type
 *
 * @package App\Models
 */
class Property extends Model
{
	protected $table = 'properties';

	protected $casts = [
		'daily' => 'int',
		'municipality_id' => 'int',
		'property_status_id' => 'int',
		'deed_no' => 'int',
		'sale_date' => 'datetime',
		'transaction_type_id' => 'int',
		'zip_code' => 'int',
		'property_type_id' => 'int',
		'mortgagee_id' => 'int',
		'mortgagee_amount' => 'float',
		'interest_rate' => 'float',
		'area_sqr_meter' => 'float',
		'area_sqr_feet' => 'float',
		'area_cuerdas' => 'float',
		'price' => 'float',
		'price_sqr_meter' => 'float',
		'price_sqr_feet' => 'float',
		'price_cuerdas' => 'float',
		'property_condition_id' => 'int',
		'public_web' => 'bool'
	];

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
		'price',
		'price_sqr_meter',
		'price_sqr_feet',
		'price_cuerdas',
		'gla_sf',
		'gba_sf',
		'zoning',
		'flood_zone',
		'past_current_use',
		'property_condition_id',
		'public_web'
	];

	protected static function booted(): void
	{
		// When a property is created/updated/deleted, bump map cache version
		static::saved(function (Property $property): void {
			// Only bump when relevant fields affect map visibility
			if ($property->isDirty(['latitude', 'longitude', 'public_web'])) {
				Cache::increment('map:version');
			}
		});

		static::deleted(function (Property $property): void {
			Cache::increment('map:version');
		});
	}

	// Scopes
	public function scopePublicWeb(Builder $query): Builder
	{
		return $query->where('public_web', true);
	}

	public function scopeInBounds(Builder $query, float $north, float $south, float $east, float $west): Builder
	{
		return $query
			->whereNotNull('latitude')
			->whereNotNull('longitude')
			->whereBetween('latitude', [$south, $north])
			->whereBetween('longitude', [$west, $east]);
	}

	public function mortgagee()
	{
		return $this->belongsTo(Mortgagee::class);
	}

	public function municipality()
	{
		return $this->belongsTo(Municipality::class);
	}

	public function property_condition()
	{
		return $this->belongsTo(PropertyCondition::class);
	}

	public function property_status()
	{
		return $this->belongsTo(PropertyStatus::class);
	}

	public function property_type()
	{
		return $this->belongsTo(PropertyType::class);
	}

	public function transaction_type()
	{
		return $this->belongsTo(TransactionType::class);
	}
}
