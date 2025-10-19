<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Plan
 * 
 * @property int $id
 * @property string $name
 * @property string $description
 * @property float $price
 * @property int $days
 * @property string $type_plan
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|UserPayment[] $user_payments
 *
 * @package App\Models
 */
class Plan extends Model
{
	protected $table = 'plans';

	protected $casts = [
		'price' => 'float',
		'days' => 'int',
		'is_active' => 'bool'
	];

	protected $fillable = [
		'name',
		'description',
		'price',
		'days',
		'type_plan',
		'is_active'
	];

	public function user_payments()
	{
		return $this->hasMany(UserPayment::class);
	}
}
