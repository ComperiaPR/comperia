<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class PropertyStatus
 * 
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|Property[] $properties
 *
 * @package App\Models
 */
class PropertyStatus extends Model
{
	protected $table = 'property_statuses';

	protected $fillable = [
		'name',
		'slug',
		'description'
	];

	public function properties()
	{
		return $this->hasMany(Property::class);
	}
}
