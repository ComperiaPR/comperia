<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PropertyMapSearchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'q' => 'nullable|string|max:255',
            'municipality_id' => 'nullable|integer|exists:municipalities,id',
            'property_type_id' => 'nullable|integer|exists:property_types,id',
            'property_status_id' => 'nullable|integer|exists:property_statuses,id',
            'north' => 'nullable|numeric|between:-90,90',
            'south' => 'nullable|numeric|between:-90,90',
            'east' => 'nullable|numeric|between:-180,180',
            'west' => 'nullable|numeric|between:-180,180',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
            'price_min' => 'nullable|numeric|min:0',
            'price_max' => 'nullable|numeric|min:0|gte:price_min',
            'area_min' => 'nullable|numeric|min:0',
            'area_max' => 'nullable|numeric|min:0|gte:area_min',
            'page' => 'nullable|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'municipality_id.exists' => 'El municipio seleccionado es inválido.',
            'property_type_id.exists' => 'El tipo de propiedad seleccionado es inválido.',
            'property_status_id.exists' => 'El estado de la propiedad seleccionado es inválido.',
            'north.between' => 'El valor de norte debe estar entre -90 y 90.',
            'south.between' => 'El valor de sur debe estar entre -90 y 90.',
            'east.between' => 'El valor de este debe estar entre -180 y 180.',
            'west.between' => 'El valor de oeste debe estar entre -180 y 180.',
            'date_to.after_or_equal' => 'La fecha final debe ser posterior o igual a la fecha inicial.',
            'price_max.gte' => 'El precio máximo debe ser mayor o igual al precio mínimo.',
            'area_max.gte' => 'El área máxima debe ser mayor o igual al área mínima.',
        ];
    }
}
