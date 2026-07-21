<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Property;
use App\Repositories\Contracts\PropertyInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
// use Illuminate\Support\Facades\Request;

class PropertyService
{
    private const DEED_PDF_DISK = 'public';
    private const DEED_PDF_DIRECTORY = 'properties/deeds';

    private PropertyInterface $propertyRepository;

    public function __construct(PropertyInterface $propertyRepository)
    {
        $this->propertyRepository = $propertyRepository;
    }

    public function store(Request $propertyRequest): Property
    {
        $this->storeDeedPdf($propertyRequest);

        return $this->propertyRepository->store($propertyRequest);
    }

    public function update(Property $property, Request $propertyUpdateDTO): Property
    {
        $this->storeDeedPdf($propertyUpdateDTO, $property);

        return $this->propertyRepository->update($property, $propertyUpdateDTO);
    }

    /**
     * Sube el PDF de la escritura al storage y agrega la ruta resultante
     * al request para que el repositorio la persista.
     */
    private function storeDeedPdf(Request $propertyRequest, ?Property $property = null): void
    {
        if (! $propertyRequest->hasFile('deed_pdf')) {
            return;
        }

        if ($property?->deed_pdf_path) {
            Storage::disk(self::DEED_PDF_DISK)->delete($property->deed_pdf_path);
        }

        $path = $propertyRequest->file('deed_pdf')->store(self::DEED_PDF_DIRECTORY, self::DEED_PDF_DISK);

        $propertyRequest->merge(['deed_pdf_path' => $path]);
    }

    public function getProperties(Request $propertyRequest): LengthAwarePaginator
    {
        return $this->propertyRepository->getProperties($propertyRequest);
    }

    public function getClientProperties(Request $propertyRequest): LengthAwarePaginator
    {
        return $this->propertyRepository->getClientProperties($propertyRequest);
    }
}
