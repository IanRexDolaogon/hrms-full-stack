<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
   public function index(Request $request)
    {
        if ($request->has('with') && $request->with === 'roles') {
            return response()->json(User::with('roles')->get());
        }
        
        return response()->json(User::all());
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'role' => 'required|string|in:admin,employee'
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // 2. Sync their Spatie Role (This removes old roles and applies the new one)
        $user->syncRoles([$request->role]);

        // Return the fresh user with their new role and avatar loaded
        return response()->json($user->load('roles'));
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);

        // Safety check 1: Prevent deleting yourself
        if (request()->user()->id === $user->id) {
            return response()->json(['message' => 'You cannot delete your own account.'], 403);
        }

        // Safety check 2: Prevent deleting another Admin
        if ($user->hasRole('admin')) {
            return response()->json(['message' => 'Action denied. You must demote this user to Employee before terminating them.'], 403);
        }

        $user->delete(); 
        return response()->json(['message' => 'Employee successfully terminated.']);
    }
    public function show(Request $request)
    {
        return response()->json($request->user()->load('roles')); 
    }
}