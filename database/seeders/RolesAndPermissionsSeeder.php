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
        $superUserRole = Role::create(['name' => 'super_user']);
        $clientRole = Role::create(['name' => 'client']);
        $writerRole = Role::create(['name' => 'writer']);

        // Create permissions
        $createPropertyPermission = Permission::create(['name' => 'create property']);
        $editPropertyPermission = Permission::create(['name' => 'edit property']);
        $deletePropertyPermission = Permission::create(['name' => 'delete property']);

        // Assign permissions to roles
        $adminRole->givePermissionTo($createPropertyPermission);
        $adminRole->givePermissionTo($editPropertyPermission);
        $adminRole->givePermissionTo($deletePropertyPermission);

        // Assign permissions to roles
        $superUserRole->givePermissionTo($createPropertyPermission);
        $superUserRole->givePermissionTo($editPropertyPermission);
        $superUserRole->givePermissionTo($deletePropertyPermission);

        $writerRole->givePermissionTo($createPropertyPermission);
        $writerRole->givePermissionTo($editPropertyPermission);

        // $clientRole->givePermissionTo($createPropertyPermission);

    }
}
