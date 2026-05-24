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
        $query = Property::query();

        $query->limit(10000);

        return $query->orderBy('id', 'asc');
    }

    public function headings(): array
    {
        return [
            'ID'
        ];
    }

    public function map($property): array
    {
        
        return [
            $property->id,
            $property->daily,
            $property->page_entry,
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
