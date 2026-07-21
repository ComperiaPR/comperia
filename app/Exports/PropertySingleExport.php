<?php

declare(strict_types=1);

namespace App\Exports;

use App\Models\Property;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PropertySingleExport implements FromArray, WithStyles
{
    protected Property $property;

    /** Row numbers (1-indexed, including the title row) that act as section headers. */
    protected array $sectionRows = [];

    public function __construct(Property $property)
    {
        $this->property = $property;
    }

    public function array(): array
    {
        $p = $this->property;
        $rows = [];

        $rows[] = ['Property Number: ' . $p->id, ''];
        $rows[] = ['Property Type', $p->property_type->name ?? ''];
        $rows[] = ['Type of Transaction', $p->transaction_type->name ?? ''];
        $rows[] = ['Sale Date', optional($p->sale_date)->format('Y-m-d')];

        $this->sectionRows[] = count($rows) + 1;
        $rows[] = ['Address', ''];
        $rows[] = ['Municipality', $p->municipality->name ?? ''];
        $rows[] = ['Development', $p->development];
        $rows[] = ['Street', $p->street];
        $rows[] = ['Unit No', $p->unit_number];
        $rows[] = ['Ward', $p->ward];
        $rows[] = ['Sector', $p->sector];
        $rows[] = ['Road/Km.', $p->road_kilometer];
        $rows[] = ['Zip Code', $p->zip_code];
        $rows[] = ['Tax ID', $p->cadastre];
        $rows[] = ['Latitude', $p->latitude];
        $rows[] = ['Longitude', $p->longitude];
        $rows[] = ['Google Maps', ($p->latitude && $p->longitude) ? "https://maps.google.com/?q={$p->latitude},{$p->longitude}" : ''];

        $rows[] = ['Seller', $p->seller];
        $rows[] = ['Resident of Seller', $p->resident_seller];
        $rows[] = ['Buyer', $p->buyer];
        $rows[] = ['Resident of Buyer', $p->resident_buyer];
        $rows[] = ['Notary', $p->notary];
        $rows[] = ['Deed No.', $p->deed_no];
        $rows[] = ['Registry', $p->registry];
        $rows[] = ['Track No.', $p->track_no];
        $rows[] = ['Daily', $p->daily];
        $rows[] = ['Page Entry', $p->page_entry];
        $rows[] = ['Inscription', $p->inscription];

        $this->sectionRows[] = count($rows) + 1;
        $rows[] = ['Sale Price', $p->price !== null ? (float) $p->price : ''];
        $rows[] = ['Price / Sq. Meter', $p->price_sqr_meter !== null ? (float) $p->price_sqr_meter : ''];
        $rows[] = ['Price / Sq. Feet', $p->price_sqr_feet !== null ? (float) $p->price_sqr_feet : ''];
        $rows[] = ['Price / Cuerda', $p->price_cuerdas !== null ? (float) $p->price_cuerdas : ''];

        $this->sectionRows[] = count($rows) + 1;
        $rows[] = ['Lot Area', ''];
        $rows[] = ['Sq. Meter', $p->area_sqr_meter];
        $rows[] = ['Sq. Feet', $p->area_sqr_feet];
        $rows[] = ['Cuerdas', $p->area_cuerdas];

        $rows[] = ['GLA +/- SF', $p->gla_sf];
        $rows[] = ['GBA +/- SF', $p->gba_sf];
        $rows[] = ['Zoning', $p->zoning];
        $rows[] = ['Flood Zone', $p->flood_zone];
        $rows[] = ['Property Condition', $p->property_condition->name ?? ''];
        $rows[] = ['Property Past / Current Use', $p->past_current_use];
        $rows[] = ['Mortgagee', $p->mortgagee->name ?? ''];
        $rows[] = ['Mortgagee Amount', $p->mortgagee_amount !== null ? (float) $p->mortgagee_amount : ''];
        $rows[] = ['Interest Rate %', $p->interest_rate];
        $rows[] = ['Remarks', $p->remarks];

        return $rows;
    }

    public function styles(Worksheet $sheet): array
    {
        $sheet->getColumnDimension('A')->setWidth(28);
        $sheet->getColumnDimension('B')->setWidth(50);
        $sheet->getStyle('A')->getFont()->setBold(true);

        $sheet->getStyle('A1:B1')->getFont()->setBold(true)->setSize(13);

        foreach ($this->sectionRows as $row) {
            $sheet->getStyle("A{$row}:B{$row}")->getFont()->setBold(true)->getColor()->setRGB('FFFFFF');
            $sheet->getStyle("A{$row}:B{$row}")->getFill()
                ->setFillType(Fill::FILL_SOLID)
                ->getStartColor()->setRGB('2563EB');
        }

        return [];
    }
}
