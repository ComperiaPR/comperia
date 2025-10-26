<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model; // Kept for phpdoc types
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

/**
 * Class User
 *
 * @property int $id
 * @property string $email
 * @property string $username
 * @property string|null $document
 * @property string $first_name
 * @property string $last_name
 * @property string|null $company_name
 * @property string $address_main
 * @property string|null $address_secondary
 * @property string|null $zip_code
 * @property string $password
 * @property Carbon|null $email_verified_at
 * @property bool $terms
 * @property bool $is_active
 * @property Carbon|null $date_start
 * @property Carbon|null $date_finish
 * @property int $municipality_id
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Municipality $municipality
 * @property Collection|UserPayment[] $user_payments
 */
class User extends Authenticatable
{
	use HasFactory, Notifiable, HasRoles;

	protected $table = 'users';

	protected $casts = [
		'email_verified_at' => 'datetime',
		'terms' => 'bool',
		'is_active' => 'bool',
		'date_start' => 'datetime',
		'date_finish' => 'datetime',
		'municipality_id' => 'int',
	];

	protected $hidden = [
		'password',
		'remember_token',
	];

	protected $fillable = [
		'email',
		'username',
		'document',
		'first_name',
		'last_name',
		'company_name',
		'address_main',
		'address_secondary',
		'zip_code',
		'password',
		'email_verified_at',
		'terms',
		'is_active',
		'date_start',
		'date_finish',
		'municipality_id',
		'remember_token',
	];

	public function municipality()
	{
		return $this->belongsTo(Municipality::class);
	}

	public function user_payments()
	{
		return $this->hasMany(UserPayment::class);
	}
}
