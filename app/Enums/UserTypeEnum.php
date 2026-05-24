<?php

declare(strict_types=1);

namespace App\Enums;

enum UserTypeEnum: string
{
    case Individual = 'individual';
    case Corporate = 'corporate';

    public static function labels(): array
    {
        return [
            self::Individual->value => 'Individual',
            self::Corporate->value => 'Corporate',
        ];
    }

    public function label(): string
    {
        return self::labels()[$this->value];
    }
}
