<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        $adminRole = Role::create(['name' => 'admin']);
        $editorRole = Role::create(['name' => 'editor']);
        $userRole = Role::create(['name' => 'user']);

        // Create permissions
        $createPropertyPermission = Permission::create(['name' => 'create property']);
        $editPropertyPermission = Permission::create(['name' => 'edit property']);
        $deletePropertyPermission = Permission::create(['name' => 'delete property']);

        // Assign permissions to roles
        $adminRole->givePermissionTo($createPropertyPermission);
        $adminRole->givePermissionTo($editPropertyPermission);
        $adminRole->givePermissionTo($deletePropertyPermission);

        $editorRole->givePermissionTo($createPropertyPermission);
        $editorRole->givePermissionTo($editPropertyPermission);

        $userRole->givePermissionTo($createPropertyPermission);

    }
}
