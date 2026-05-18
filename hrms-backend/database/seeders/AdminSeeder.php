<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure the admin role exists (just in case)
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'employee']);

        // 2. Create the master admin user
        $admin = User::create([
            'name' => 'Master Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password123'), // Use a safe password
        ]);

        // 3. Assign the admin role
        $admin->assignRole('admin');
    }
}