<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class UserPayment
 * 
 * @property int $id
 * @property int $user_id
 * @property int $plan_id
 * @property int $payment_type_id
 * @property string $ip
 * @property Carbon $date_start
 * @property Carbon $date_finish
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property PaymentType $payment_type
 * @property Plan $plan
 * @property User $user
 *
 * @package App\Models
 */
class UserPayment extends Model
{
	protected $table = 'user_payments';

	protected $casts = [
		'user_id' => 'int',
		'plan_id' => 'int',
		'payment_type_id' => 'int',
		'date_start' => 'datetime',
		'date_finish' => 'datetime'
	];

	protected $fillable = [
		'user_id',
		'plan_id',
		'payment_type_id',
		'ip',
		'date_start',
		'date_finish'
	];

	public function payment_type()
	{
		return $this->belongsTo(PaymentType::class);
	}

	public function plan()
	{
		return $this->belongsTo(Plan::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
