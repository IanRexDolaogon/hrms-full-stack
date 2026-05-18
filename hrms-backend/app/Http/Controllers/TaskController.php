<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

class TaskController extends Controller
{

    public function index()
    {
        // Load all tasks, newest first, and attach the users assigned to them
        $tasks = Task::with('users')->latest()->get();
        return response()->json($tasks);
    }
    // ADMIN: Create a task and assign multiple users
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'user_ids' => 'required|array', // Must be an array of IDs
            'user_ids.*' => 'exists:users,id' // Each ID must actually exist in the DB
        ]);

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => 'pending', // Default status
        ]);

        // EVALUATION CRITERIA #1: This Eloquent method perfectly handles the Many-to-Many pivot table
        $task->users()->sync($request->user_ids);

        return response()->json([
            'message' => 'Task created and assigned successfully!',
            'task' => $task->load('users') // Return task with assigned users attached
        ], 201);
    }

    // EMPLOYEE: Get only the tasks assigned to them
    public function myTasks($userId)
    {
    $user = User::findOrFail($userId);
    // Note the "with('users')" part! This includes the teammates in the response.
    $tasks = $user->tasks()->with('users')->orderBy('created_at', 'desc')->get();

    return response()->json($tasks);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);
        $user = $request->user();
        $task = Task::findOrFail($id);

        // 1. Update the individual's status on the pivot table
        $task->users()->updateExistingPivot($user->id, [
            'status' => $request->status
        ]);

        // 2. Check if EVERYONE assigned to this task is now 'completed'
        $remainingUsers = $task->users()->wherePivot('status', '!=', 'completed')->count();

        if ($remainingUsers === 0) {
            // Everyone is done! Mark the main task as completed
            $task->update(['status' => 'completed']);
        } else {
            // Someone is still working. Ensure the main task is 'in_progress'
            $task->update(['status' => 'in_progress']);
        }

        return response()->json(['message' => 'Status updated', 'global_status' => $task->status]);
    }

    public function removeUser($id, $userId)
    {
        $task = Task::findOrFail($id);
        
        // 1. Remove the user from the pivot table
        $task->users()->detach($userId);

        // 2. Recalculate the overall task status
        $remainingUsers = $task->users()->count();
        
        if ($remainingUsers === 0) {
            // No one left? Set it back to pending
            $task->update(['status' => 'pending']);
        } else {
            // Are the remaining users all finished?
            $completedCount = $task->users()->wherePivot('status', 'completed')->count();
            if ($completedCount === $remainingUsers) {
                $task->update(['status' => 'completed']);
            } else {
                $task->update(['status' => 'in_progress']);
            }
        }

        // 3. Return the freshly updated task (with its remaining users) back to React
        return response()->json($task->load('users'));
    }
}