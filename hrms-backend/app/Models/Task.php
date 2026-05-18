<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    // This allows us to use Task::create() safely
    protected $fillable = [
        'title',
        'description',
        'status',
    ];

    // This defines the Many-to-Many relationship with Users
    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}