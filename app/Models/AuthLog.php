<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class AuthLog
 *
 * @property int $id
 * @property int|null $user_id
 * @property string $email
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property Carbon $login_at
 * @property Carbon|null $logout_at
 *
 * @property User|null $user
 */
class AuthLog extends Model
{
    protected $fillable = [
        'user_id',
        'email',
        'ip_address',
        'user_agent',
        'login_at',
        'logout_at',
    ];

    protected $casts = [
        'login_at' => 'datetime',
        'logout_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
