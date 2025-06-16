<?php

declare(strict_types=1);

namespace App\DTOs;

final readonly class PropertyCreateDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $address,
        public readonly string $description,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'] ?? null,
            address: $data['address'] ?? null,
            description: $data['description'] ?? null,
        );
    }
}
