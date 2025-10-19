<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Class Municipality
 *
 * @property int $id
 * @property string $name
 * @property string $latitude
 * @property string $longitude
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Collection|Property[] $properties
 * @property Collection|User[] $users
 */
class Municipality extends Model
{
    use HasFactory;

    protected $table = 'municipalities';

    protected $casts = [
        'is_active' => 'bool',
    ];

    protected $fillable = [
        'name',
        'latitude',
        'longitude',
        'is_active',
    ];

    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
