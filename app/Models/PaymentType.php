<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class PaymentType
 * 
 * @property int $id
 * @property string $name
 * @property string $description
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|UserPayment[] $user_payments
 *
 * @package App\Models
 */
class PaymentType extends Model
{
	protected $table = 'payment_types';

	protected $casts = [
		'is_active' => 'bool'
	];

	protected $fillable = [
		'name',
		'description',
		'is_active'
	];

	public function user_payments()
	{
		return $this->hasMany(UserPayment::class);
	}
}
