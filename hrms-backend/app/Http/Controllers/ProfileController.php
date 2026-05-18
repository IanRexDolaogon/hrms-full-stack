<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfileController extends Controller
{
    // Fetch the logged-in user's details and their avatar
    public function show(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->getRoleNames(),
            // Spatie Magic: instantly grab the public URL of their image
            'avatar_url' => $user->getFirstMediaUrl('avatars') 
        ]);
    }

    // Handle the image upload
    public function updateAvatar(Request $request)
    {
        // 1. Validate that they actually uploaded an image and it's not too big (2MB limit)
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();

        // 2. Clear out any old profile pictures 
        $user->clearMediaCollection('avatars');

        // 3. Spatie Magic: Take the file from the request, save it, and link it to the user in the DB
        $user->addMediaFromRequest('avatar')->toMediaCollection('avatars');

        return response()->json([
            'message' => 'Profile picture updated successfully!',
            'avatar_url' => $user->getFirstMediaUrl('avatars')
        ]);
    }
}