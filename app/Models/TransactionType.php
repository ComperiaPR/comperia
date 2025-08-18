<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TransactionType extends Model
{
    // Tabla por defecto: 'transaction_types'

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
     * Relación: un tipo de transacción puede tener muchas propiedades.
     */
    public function properties(): HasMany
    {
        return $this->hasMany(Property::class, 'transaction_type_id');
    }
}
