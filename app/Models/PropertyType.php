<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PropertyType extends Model
{
    // Tabla por defecto: 'property_types'

    protected $fillable = [
        'name',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Scope para obtener solo tipos activos.
     */
    public function scopeActive(Builder $query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Relación: un tipo de propiedad puede tener muchas propiedades.
     */
    public function properties(): HasMany
    {
        return $this->hasMany(Property::class, 'property_type_id');
    }
}
