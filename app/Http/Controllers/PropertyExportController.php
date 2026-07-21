<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Exports\PropertySingleExport;
use App\Models\Property;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PropertyExportController extends Controller
{
    private function loadProperty(Property $property): Property
    {
        return $property->load(['municipality', 'property_type', 'transaction_type', 'property_condition', 'mortgagee']);
    }

    public function pdf(Property $property, Request $request): Response
    {
        $property = $this->loadProperty($property);

        $pdf = Pdf::loadView('exports.property-pdf', ['property' => $property])->setPaper('letter');
        $fileName = 'property-' . $property->id . '.pdf';

        // "Print" opens the PDF inline (native browser PDF viewer, with its own
        // print/download controls) instead of forcing a file download.
        if ($request->boolean('inline')) {
            return $pdf->stream($fileName);
        }

        return $pdf->download($fileName);
    }

    public function excel(Property $property)
    {
        $property = $this->loadProperty($property);

        return Excel::download(new PropertySingleExport($property), 'property-' . $property->id . '.xlsx');
    }

    public function word(Property $property): StreamedResponse
    {
        $property = $this->loadProperty($property);

        $phpWord = new PhpWord();
        $section = $phpWord->addSection();

        $titleFont = ['bold' => true, 'size' => 14];
        $sectionFont = ['bold' => true, 'size' => 11, 'color' => 'FFFFFF'];
        $sectionShading = ['fill' => '2563EB'];
        $labelFont = ['bold' => true, 'size' => 9];
        $valueFont = ['size' => 9];

        $section->addText('Property Number: ' . $property->id, $titleFont);
        $section->addTextBreak();

        $addRow = function ($table, string $label, $value) use ($labelFont, $valueFont) {
            $cell = $table->addCell(3000);
            $cell->addText($label, $labelFont);
            $cell->addText((string) ($value ?? ''), $valueFont);
        };

        $addSectionHeader = function (string $title) use ($section, $sectionFont, $sectionShading) {
            $section->addText($title, $sectionFont, ['shading' => $sectionShading, 'spaceAfter' => 100]);
        };

        $tableStyle = ['borderSize' => 0, 'cellMargin' => 80];

        $basic = $section->addTable($tableStyle);
        $basic->addRow();
        $addRow($basic, 'Property Type:', $property->property_type->name ?? '');
        $addRow($basic, 'Type of Transaction:', $property->transaction_type->name ?? '');
        $addRow($basic, 'Sale Date:', optional($property->sale_date)->format('Y-m-d'));

        $addSectionHeader('Address');
        $address = $section->addTable($tableStyle);
        $address->addRow();
        $addRow($address, 'Municipality:', $property->municipality->name ?? '');
        $addRow($address, 'Development:', $property->development);
        $addRow($address, 'Street:', $property->street);
        $address->addRow();
        $addRow($address, 'Unit No:', $property->unit_number);
        $addRow($address, 'Ward:', $property->ward);
        $addRow($address, 'Sector:', $property->sector);
        $address->addRow();
        $addRow($address, 'Road/Km.:', $property->road_kilometer);
        $addRow($address, 'Zip Code:', $property->zip_code);
        $addRow($address, 'Tax ID:', $property->cadastre);
        $address->addRow();
        $addRow($address, 'Latitude:', $property->latitude);
        $addRow($address, 'Longitude:', $property->longitude);
        $addRow($address, 'Google Maps:', ($property->latitude && $property->longitude)
            ? "https://maps.google.com/?q={$property->latitude},{$property->longitude}"
            : '');

        $parties = $section->addTable($tableStyle);
        $parties->addRow();
        $addRow($parties, 'Seller:', $property->seller);
        $addRow($parties, 'Resident of Seller:', $property->resident_seller);
        $addRow($parties, 'Buyer:', $property->buyer);
        $parties->addRow();
        $addRow($parties, 'Resident of Buyer:', $property->resident_buyer);
        $addRow($parties, 'Notary:', $property->notary);
        $addRow($parties, 'Deed No.:', $property->deed_no);
        $parties->addRow();
        $addRow($parties, 'Registry:', $property->registry);
        $addRow($parties, 'Track No.:', $property->track_no);
        $addRow($parties, 'Daily:', $property->daily);
        $parties->addRow();
        $addRow($parties, 'Page Entry:', $property->page_entry);
        $addRow($parties, 'Inscription:', $property->inscription);
        $addRow($parties, '', '');

        $addSectionHeader('Sale Price: ' . ($property->price !== null ? '$' . number_format((float) $property->price, 2) : ''));
        $price = $section->addTable($tableStyle);
        $price->addRow();
        $addRow($price, 'Price / Sq. Meter:', $property->price_sqr_meter !== null ? '$' . number_format((float) $property->price_sqr_meter, 2) : '');
        $addRow($price, 'Price / Sq. Feet:', $property->price_sqr_feet !== null ? '$' . number_format((float) $property->price_sqr_feet, 2) : '');
        $addRow($price, 'Price / Cuerda:', $property->price_cuerdas !== null ? '$' . number_format((float) $property->price_cuerdas, 2) : '');

        $addSectionHeader('Lot Area');
        $area = $section->addTable($tableStyle);
        $area->addRow();
        $addRow($area, 'Sq. Meter:', $property->area_sqr_meter);
        $addRow($area, 'Sq. Feet:', $property->area_sqr_feet);
        $addRow($area, 'Cuerdas:', $property->area_cuerdas);

        $extra = $section->addTable($tableStyle);
        $extra->addRow();
        $addRow($extra, 'GLA +/- SF:', $property->gla_sf);
        $addRow($extra, 'GBA +/- SF:', $property->gba_sf);
        $addRow($extra, 'Zoning:', $property->zoning);
        $extra->addRow();
        $addRow($extra, 'Flood Zone:', $property->flood_zone);
        $addRow($extra, 'Property Condition:', $property->property_condition->name ?? '');
        $addRow($extra, '', '');
        $extra->addRow();
        $addRow($extra, 'Mortgagee:', $property->mortgagee->name ?? '');
        $addRow($extra, 'Mortgagee Amount:', $property->mortgagee_amount !== null ? '$' . number_format((float) $property->mortgagee_amount, 2) : '');
        $addRow($extra, 'Interest Rate %:', $property->interest_rate);

        $section->addText('Property Past / Current Use:', $labelFont);
        $section->addText((string) $property->past_current_use, $valueFont);
        $section->addTextBreak();
        $section->addText('Remarks:', $labelFont);
        $section->addText((string) $property->remarks, $valueFont);

        $fileName = 'property-' . $property->id . '.docx';
        $tempFile = tempnam(sys_get_temp_dir(), 'docx');

        IOFactory::createWriter($phpWord, 'Word2007')->save($tempFile);

        return response()->streamDownload(function () use ($tempFile) {
            echo file_get_contents($tempFile);
            unlink($tempFile);
        }, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]);
    }
}
