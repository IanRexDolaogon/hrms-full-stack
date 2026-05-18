<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // 1. Validate the incoming data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed', // requires password_confirmation field
        ]);

        // 2. Create the user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // 3. Spatie Requirement: Assign default employee role
        $user->assignRole('employee');

        // 4. Generate Sanctum Token
        $token = $user->createToken('auth_token')->plainTextToken;

        // 5. Return success response (loading roles so React knows who they are)
        return response()->json([
            'message' => 'Registration successful',
            'token' => $token,
            'user' => $user->load('roles')
        ], 201);
    }

    public function login(Request $request)
    {
        // 1. Validate the request
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Attempt authentication
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid login credentials'
            ], 401);
        }

        // 3. Get user and generate token
        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Return token and user data
        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user->load('roles')
        ]);
    }
}