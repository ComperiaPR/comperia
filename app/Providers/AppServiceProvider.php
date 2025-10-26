<?php

namespace App\Providers;

use App\Repositories\Contracts\PropertyInterface;
use App\Repositories\Contracts\PropertyMapInterface;
use App\Repositories\PropertyRepository;
use App\Repositories\PropertyMapRepository;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            PropertyInterface::class,
            PropertyRepository::class,
        );

        $this->app->bind(
            PropertyMapInterface::class,
            PropertyMapRepository::class,
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();
    }
}
