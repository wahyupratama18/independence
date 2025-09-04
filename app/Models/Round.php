<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Round extends Model
{
    /** @use HasFactory<\Database\Factories\RoundFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'correct_points',
        'incorrect_points',
        'last_members_kicked',
        'is_knocked_out',
    ];

    /**
     * Get all of the games for the Round
     */
    public function games(): HasMany
    {
        return $this->hasMany(Game::class);
    }
}
