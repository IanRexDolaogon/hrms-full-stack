<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create the Master Admin
        $admin = User::create([
            'name' => 'System Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password123'),
        ]);
        $admin->assignRole('admin');

        // 2. Create several Employees
        $employees = [
            ['name' => 'Rex Dolaogon', 'email' => 'rex@ian.com'],
            ['name' => 'Test Dummy 1', 'email' => 'test@1.com'],
            ['name' => 'Test Dummy 2', 'email' => 'test@2.com'],
            ['name' => 'Test Dummy 3', 'email' => 'test@3.com'],
        ];

        foreach ($employees as $emp) {
            $user = User::create([
                'name' => $emp['name'],
                'email' => $emp['email'],
                'password' => Hash::make('password123'),
            ]);
            $user->assignRole('employee');
        }
    }
}