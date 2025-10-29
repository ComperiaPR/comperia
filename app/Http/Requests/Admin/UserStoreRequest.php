<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

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
            'identification' => ['required', 'string'],
            'first_name' => ['required', 'string'],
            'last_name' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'El campo nombre es obligatorio',
            'last_name.required' => 'El campo apellido es obligatorio',
            'identification.required' => 'El campo identificación es obligatorio',
        ];
    }
}
