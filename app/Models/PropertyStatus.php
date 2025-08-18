<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PropertyStatus extends Model
{
    // Tabla por defecto: 'property_statuses'

    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Scope para obtener solo estados activos.
     */
    public function scopeActive(Builder $query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Relación: un estado de propiedad puede tener muchas propiedades.
     */
    public function properties(): HasMany
    {
        return $this->hasMany(Property::class, 'property_status_id');
    }
}
