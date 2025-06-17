<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PropertyUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        // return $this->user()->can(PermissionsEnum::UpdateProperties);
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'address' => ['required', 'string', 'max:100'],
            'description' => ['required'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El campo nombre de la propiedad es requerido',
            'name.string' => 'El nombre de la propiedad debe ser una cadena de texto',
            'name.max' => 'El nombre de la propiedad no puede tener más de 100 caracteres',
            'address.required' => 'El campo dirección de la propiedad es requerido',
            'address.string' => 'La dirección de la propiedad debe ser una cadena de texto',
            'address.max' => 'La dirección de la propiedad no puede tener más de 100 caracteres',
            'description.required' => 'El campo descripción de la propiedad es requerido',
        ];
    }
}
