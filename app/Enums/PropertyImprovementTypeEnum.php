<?php

declare(strict_types=1);

namespace App\Enums;

enum PropertyImprovementTypeEnum: string
{
    case AddGba = 'add_gba';
    case AddGla = 'add_gla';
    case AddData = 'add_data';
    case IncorrectTaxId = 'incorrect_tax_id';
    case IncorrectPropertyType = 'incorrect_property_type';
    case Other = 'other';

    public static function labels(): array
    {
        return [
            self::AddGba->value => 'Add GBA +/- SF',
            self::AddGla->value => 'Add GLA +/- SF',
            self::AddData->value => 'Add Data',
            self::IncorrectTaxId->value => 'Incorrect Tax ID',
            self::IncorrectPropertyType->value => 'Incorrect Property Type',
            self::Other->value => 'Other Reason',
        ];
    }

    public function label(): string
    {
        return self::labels()[$this->value];
    }
}
