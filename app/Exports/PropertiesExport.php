<?php

namespace App\Exports;

use App\Models\Property;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PropertiesExport implements FromQuery, WithHeadings, WithMapping, WithStyles
{
    protected array $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function query(): Builder
    {
        $query = Property::query()->with([
            'municipality',
            'property_status',
            'transaction_type',
            'property_type',
            'mortgagee',
            'property_condition',
        ]);

        $query->limit(10000);

        return $query->orderBy('id', 'asc');
    }

    public function headings(): array
    {
        return [
            'ID',
            'Daily',
            'Page Entry',
            'Track No',
            'Municipality',
            'Property Status',
            'Registry',
            'Deed No',
            'Sale Date',
            'Transaction Type',
            'Notary',
            'Seller',
            'Resident Seller',
            'Buyer',
            'Resident Buyer',
            'Development',
            'Street',
            'Unit Number',
            'Ward',
            'Sector',
            'Road Kilometer',
            'Zip Code',
            'Cadastre',
            'Property Type',
            'Folio Page',
            'Volumen',
            'Inscription',
            'Source',
            'Remarks',
            'Mortgagee',
            'Mortgagee Amount',
            'Interest Rate',
            'Latitude',
            'Longitude',
            'Area (Sqr Meter)',
            'Area (Sqr Feet)',
            'Area (Cuerdas)',
            'Price',
            'Price (Sqr Meter)',
            'Price (Sqr Feet)',
            'Price (Cuerdas)',
            'GLA SF',
            'GBA SF',
            'Zoning',
            'Flood Zone',
            'Past/Current Use',
            'Property Condition',
            'Public Web',
            'Created At',
            'Updated At',
        ];
    }

    public function map($property): array
    {
        return [
            $property->id,
            $property->daily,
            $property->page_entry,
            $property->track_no,
            $property->municipality?->name,
            $property->property_status?->name,
            $property->registry,
            $property->deed_no,
            $property->sale_date?->format('Y-m-d'),
            $property->transaction_type?->name,
            $property->notary,
            $property->seller,
            $property->resident_seller,
            $property->buyer,
            $property->resident_buyer,
            $property->development,
            $property->street,
            $property->unit_number,
            $property->ward,
            $property->sector,
            $property->road_kilometer,
            $property->zip_code,
            $property->cadastre,
            $property->property_type?->name,
            $property->folio_page,
            $property->volumen,
            $property->inscription,
            $property->source,
            $property->remarks,
            $property->mortgagee?->name,
            $property->mortgagee_amount,
            $property->interest_rate,
            $property->latitude,
            $property->longitude,
            $property->area_sqr_meter,
            $property->area_sqr_feet,
            $property->area_cuerdas,
            $property->price,
            $property->price_sqr_meter,
            $property->price_sqr_feet,
            $property->price_cuerdas,
            $property->gla_sf,
            $property->gba_sf,
            $property->zoning,
            $property->flood_zone,
            $property->past_current_use,
            $property->property_condition?->name,
            $property->public_web ? 'Yes' : 'No',
            $property->created_at?->format('Y-m-d H:i:s'),
            $property->updated_at?->format('Y-m-d H:i:s'),
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            // Estilo para la fila de encabezados
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4F46E5'], // Color morado de Enrolatech
                ],
            ],
        ];
    }
}
