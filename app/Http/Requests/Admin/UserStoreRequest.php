<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UserStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        // return $this->user()->can(PermissionsEnum::CreateProperties);
        return true;
    }

    public function rules(): array
    {
        return [
            'document' => ['required', 'string'],
            'first_name' => ['required', 'string'],
            'last_name' => ['required', 'string'],
            'company_name' => ['nullable', 'string'],
            'email' => 'required|string|lowercase|email|max:120|unique:'.User::class,
            'password' => ['required', 'confirmed', Password::defaults()],
            'password_confirmation' => ['required'],
            'municipality_id' => ['required', 'integer', 'exists:municipalities,id'],
            'zip_code' => ['nullable', 'string'],
            'account_type' => ['required', 'string'],
            'phone_number' => ['nullable', 'string'],
            'cell_number' => ['required', 'string'],
            'address_main' => ['required', 'string'],
            'address_secondary' => ['nullable', 'string'],
            'role' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'El campo nombre es obligatorio',
            'last_name.required' => 'El campo apellido es obligatorio',
            'document.required' => 'El campo identificación es obligatorio',
            'email.required' => 'El campo correo electrónico es obligatorio',
            'email.email' => 'El campo correo electrónico debe ser una dirección de correo válida',
            'email.unique' => 'El correo electrónico ya está en uso',
            'password.required' => 'El campo contraseña es obligatorio',
            'password.confirmed' => 'La confirmación de la contraseña no coincide',
            'password_confirmation.required' => 'El campo confirmar contraseña es obligatorio',
            'password_confirmation.confirmed' => 'La confirmación de la contraseña no coincide',
            'password.min' => 'La contraseña debe tener al menos :min caracteres',
            'company_name.string' => 'El campo nombre de la empresa debe ser una cadena de texto',
            'zip_code.string' => 'El campo código postal debe ser una cadena de texto',
            'account_type.required' => 'El campo tipo de cuenta es obligatorio',
            'municipality_id.required' => 'El campo municipio es obligatorio',
            'municipality_id.exists' => 'El municipio seleccionado no es válido',
            'phone_number.string' => 'El campo número de teléfono debe ser una cadena de texto',
            'cell_number.string' => 'El campo número de celular debe ser una cadena de texto',
            'cell_number.required' => 'El campo número de celular es obligatorio',
            'address_main.string' => 'El campo dirección principal debe ser una cadena de texto',
            'address_secondary.string' => 'El campo dirección secundaria debe ser una cadena de texto',
            'address_main.required' => 'El campo dirección principal es obligatorio',
            'role.required' => 'El campo rol es obligatorio',
            'role.string' => 'El campo rol debe ser una cadena de texto',
        ];
    }
}
