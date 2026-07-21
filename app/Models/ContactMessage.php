<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\PropertyImprovementTypeEnum;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ContactMessage
 *
 * @property int $id
 * @property int|null $user_id
 * @property string $type contact | improvement
 * @property int|null $property_id
 * @property string|null $improvement_type
 * @property string $name
 * @property string $email
 * @property string|null $subject
 * @property string $message
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 *
 * @property User|null $user
 * @property Property|null $property
 * @property-read string|null $improvement_type_label
 */
class ContactMessage extends Model
{
    protected $table = 'contact_messages';

    protected $fillable = [
        'user_id',
        'type',
        'property_id',
        'improvement_type',
        'name',
        'email',
        'subject',
        'message',
    ];

    protected $appends = [
        'improvement_type_label',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function getImprovementTypeLabelAttribute(): ?string
    {
        if (! $this->improvement_type) {
            return null;
        }

        return PropertyImprovementTypeEnum::tryFrom($this->improvement_type)?->label();
    }
}
