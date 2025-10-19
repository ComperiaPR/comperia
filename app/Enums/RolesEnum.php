<?php

declare(strict_types=1);

namespace App\Enums;

enum RolesEnum: string
{
    case Admin = 'admin';
    case SuperUser = 'super_user';
    case Client = 'client';
    case Writer = 'writer';
    case Interventoria = 'interventoria';

    public static function labels(): array
    {
        return [
            self::Admin->value => 'Administrador',
            self::SuperUser->value => 'Super Usuario',
            self::Client->value => 'Cliente',
            self::Writer->value => 'Digitador',
            self::Interventoria->value => 'Interventoria',
        ];
    }

    public function label(): string
    {
        return self::labels()[$this->value];
    }
}
