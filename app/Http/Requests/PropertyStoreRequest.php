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
            'transaction_type_id' => ['required','integer'],
            'notary' => ['nullable', 'string'],
            'seller' => ['nullable', 'string'],
            'resident_seller' => ['nullable', 'string'],
            'buyer' => ['nullable', 'string'],
            'resident_buyer' => ['nullable', 'string'],
            'development' => ['nullable', 'string'],
            'street' => ['nullable', 'string'],
            'unit_number' => ['nullable', 'string'],
            'ward' => ['nullable', 'string'],
            'sector' => ['nullable', 'string'],
            'road_kilometer' => ['nullable', 'string'],
            'zip_code' => ['nullable', 'string'],
            'cadastre' => ['nullable', 'string'],
            'property_type_id' => ['required', 'integer'],
            'folio_page' => ['nullable', 'string'],
            'volumen' => ['nullable', 'string'],
            'inscription' => ['nullable', 'string'],
            'source' => ['nullable', 'string'],
            'remarks' => ['nullable', 'string'],
            'mortgagee_id' => ['nullable', 'integer'],
            'mortgagee_amount' => ['nullable', 'numeric'],
            'interest_rate' => ['nullable', 'numeric'],
            'public_web' => ['nullable', 'boolean'],
            'latitude' => ['nullable', 'string'],
            'longitude' => ['nullable', 'string'],
            'area_sqr_meter' => ['required', 'numeric'],
            'area_sqr_feet' => ['required', 'numeric'],
            'area_cuerdas' => ['required', 'numeric'],
            'price' => ['required', 'numeric'],
            'price_sqr_meter' => ['required', 'numeric'],
            'price_sqr_feet' => ['required', 'numeric'],
            'price_cuerdas' => ['required', 'numeric'],
            'gla_sf' => ['nullable', 'string'],
            'gba_sf' => ['nullable', 'string'],
            'zoning' => ['nullable', 'string'],
            'flood_zone' => ['nullable', 'string'],
            'past_current_use' => ['nullable', 'string'],
            'property_condition_id' => ['nullable', 'numeric'],
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
            'transaction_type_id.integer' => 'El campo tipo de transacción debe ser un número entero',
            'transaction_type_id.required' => 'El campo tipo de transacción es obligatorio',
            'notary.string' => 'El campo Notary debe ser una cadena de texto',
            'seller.string' => 'El campo Seller debe ser una cadena de texto',
            'resident_seller.string' => 'El campo Resident Seller debe ser una cadena de texto',
            'buyer.string' => 'El campo Buyer debe ser una cadena de texto',
            'resident_buyer.string' => 'El campo Resident Buyer debe ser una cadena de texto',
            'development.string' => 'El campo Development debe ser una cadena de texto',
            'street.string' => 'El campo Street debe ser una cadena de texto',
            'unit_number.string' => 'El campo Unit Number debe ser una cadena de texto',
            'ward.string' => 'El campo Ward debe ser una cadena de texto',
            'sector.string' => 'El campo Sector debe ser una cadena de texto',
            'road_kilometer.string' => 'El campo Road / Kilometer debe ser una cadena de texto',
            'zip_code.string' => 'El campo Zip Code debe ser una cadena de texto',
            'cadastre.string' => 'El campo Cadastre debe ser una cadena de texto',
            'property_type_id.integer' => 'El campo Tipo de Propiedad debe ser un número entero',
            'property_type_id.required' => 'El campo Tipo de Propiedad es obligatorio',
            'folio_page.string' => 'El campo Folio debe ser una cadena de texto',
            'volumen.string' => 'El campo Volumen debe ser una cadena de texto',
            'inscription.string' => 'El campo Inscripción debe ser una cadena de texto',
            'source.string' => 'El campo Source debe ser una cadena de texto',
            'remarks.string' => 'El campo Remarks debe ser una cadena de texto',
            'mortgagee_id.integer' => 'El campo Mortgagee debe ser un número entero',
            'mortgagee_amount.numeric' => 'El campo Mortgagee Amount debe ser un número',
            'interest_rate.numeric' => 'El campo Interest Rate debe ser un número',
            'public_web.boolean' => 'El campo Public Web debe ser verdadero o falso',
            'latitude.string' => 'El campo Latitude debe ser una cadena de texto',
            'longitude.string' => 'El campo Longitude debe ser una cadena de texto',
            'area_sqr_meter.numeric' => 'El campo Area (Sqr. Meter) debe ser un número',
            'area_sqr_meter.required' => 'El campo Area (Sqr. Meter) es obligatorio',
            'area_sqr_feet.numeric' => 'El campo Area (Sqr. Feet) debe ser un número',
            'area_sqr_feet.required' => 'El campo Area (Sqr. Feet) es obligatorio',
            'area_cuerdas.numeric' => 'El campo Area (Cuerdas) debe ser un número',
            'area_cuerdas.required' => 'El campo Area (Cuerdas) es obligatorio',
            'price.numeric' => 'El campo Price debe ser un número',
            'price.required' => 'El campo Price es obligatorio',
            'price_sqr_meter.numeric' => 'El campo Price (Sqr. Meter) debe ser un número',
            'price_sqr_meter.required' => 'El campo Price (Sqr. Meter) es obligatorio',
            'price_sqr_feet.numeric' => 'El campo Price (Sqr. Feet) debe ser un número',
            'price_sqr_feet.required' => 'El campo Price (Sqr. Feet) es obligatorio',
            'price_cuerdas.numeric' => 'El campo Price (Cuerdas) debe ser un número',
            'price_cuerdas.required' => 'El campo Price (Cuerdas) es obligatorio',
            'gla_sf.string' => 'El campo GLA (Sqr. Feet) debe ser una cadena de texto',
            'gba_sf.string' => 'El campo GBA (Sqr. Feet) debe ser una cadena de texto',
            'zoning.string' => 'El campo Zoning debe ser una cadena de texto',
            'flood_zone.string' => 'El campo Flood Zone debe ser una cadena de texto',
            'past_current_use.string' => 'El campo Past / Current Use debe ser una cadena de texto',
            'property_condition_id.numeric' => 'El campo Property Condition debe ser un número',
        ];
    }
}
