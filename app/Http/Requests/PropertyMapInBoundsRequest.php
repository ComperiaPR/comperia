<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PropertyMapInBoundsRequest extends FormRequest
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
            'north' => 'required|numeric|between:-90,90',
            'south' => 'required|numeric|between:-90,90',
            'east' => 'required|numeric|between:-180,180',
            'west' => 'required|numeric|between:-180,180',
            'zoom' => 'required|integer|min:1|max:21',
        ];
    }

    public function messages(): array
    {
        return [
            'north.required' => 'El campo norte es obligatorio.',
            'north.numeric' => 'El campo norte debe ser un número.',
            'north.between' => 'El valor de norte debe estar entre -90 y 90.',
            'south.required' => 'El campo sur es obligatorio.',
            'south.numeric' => 'El campo sur debe ser un número.',
            'south.between' => 'El valor de sur debe estar entre -90 y 90.',
            'east.required' => 'El campo este es obligatorio.',
            'east.numeric' => 'El campo este debe ser un número.',
            'east.between' => 'El valor de este debe estar entre -180 y 180.',
            'west.required' => 'El campo oeste es obligatorio.',
            'west.numeric' => 'El campo oeste debe ser un número.',
            'west.between' => 'El valor de oeste debe estar entre -180 y 180.',
            'zoom.required' => 'El campo zoom es obligatorio.',
            'zoom.integer' => 'El campo zoom debe ser un número entero.',
            'zoom.min' => 'El valor de zoom debe ser al menos 1.',
            'zoom.max' => 'El valor de zoom no debe ser mayor que 21.',
        ];
    }
}
