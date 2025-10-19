<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PropertyStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        // return $this->user()->can(PermissionsEnum::CreateProperties);
        return true;
    }

    public function rules(): array
    {
        return [
            'daily' => ['required', 'integer'],
            'page_entry' => ['nullable', 'string'],
            'track_no' => ['nullable', 'string'],
            'municipality_id' => ['required','integer'],
            'property_status_id' => ['required','integer'],
            'registry' => ['nullable', 'string'],
            'deed_no' => ['nullable', 'integer'],
            'sale_date' => ['required', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'daily.integer' => 'El campo daily debe ser un número entero',
            'daily.max' => 'El campo daily no puede tener más de 10 caracteres',
            'daily.required' => 'El campo daily es obligatorio',
            'page_entry.string' => 'El campo page entry debe ser una cadena de texto',
            'page_entry.max' => 'El campo page entry no puede tener más de 100 caracteres',
            'track_no.string' => 'El campo track debe ser una cadena de texto',
            'track_no.max' => 'El campo track no no puede tener más de 100 caracteres',
            'municipality_id.integer' => 'El campo municipio debe ser un número entero',
            'municipality_id.required' => 'El campo municipio es obligatorio',
            'property_status_id.integer' => 'El campo estado de propiedad debe ser un número entero',
            'property_status_id.required' => 'El campo estado de propiedad es obligatorio',
            'registry.string' => 'El campo registry debe ser una cadena de texto',
            'deed_no.integer' => 'El campo deed no debe ser un número entero',
            'deed_no.max' => 'El campo deed no puede tener más de 10 caracteres',
            'sale_date.required' => 'El campo sale date es obligatorio',
            'sale_date.date' => 'El campo sale date debe ser una fecha válida',
        ];
    }
}
