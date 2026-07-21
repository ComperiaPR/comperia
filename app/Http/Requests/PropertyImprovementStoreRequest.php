<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\PropertyImprovementTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PropertyImprovementStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'improvement_type' => ['required', Rule::in(array_column(PropertyImprovementTypeEnum::cases(), 'value'))],
            'message' => ['required', 'string', 'max:5000'],
        ];
    }

    public function messages(): array
    {
        return [
            'improvement_type.required' => 'El campo Type of Improvement es obligatorio',
            'improvement_type.in' => 'El tipo de mejora seleccionado no es válido',
            'message.required' => 'El campo Message Data es obligatorio',
        ];
    }
}
