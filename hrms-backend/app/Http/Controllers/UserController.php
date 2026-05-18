<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        // Spatie provides the 'role' scope to easily grab only employees
        $employees = User::role('employee')->get(['id', 'name', 'email']);

        return response()->json($employees);
    }
}