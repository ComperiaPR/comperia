<?php

declare(strict_types=1);

namespace App\Enums;

enum UserTypeEnum: string
{
    case Personal = 'personal';
    case Business = 'business';

    public static function labels(): array
    {
        return [
            self::Personal->value => 'Personal',
            self::Business->value => 'Business',
        ];
    }

    public function label(): string
    {
        return self::labels()[$this->value];
    }
}
