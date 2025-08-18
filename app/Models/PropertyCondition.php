<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PropertyCondition extends Model
{
    // Tabla por defecto: 'property_conditions'

    protected $fillable = [
        'name',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Scope para obtener solo condiciones activas.
     */
    public function scopeActive(Builder $query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Relación: una condición de propiedad puede tener muchas propiedades.
     */
    public function properties(): HasMany
    {
        return $this->hasMany(Property::class, 'property_condition_id');
    }
}
