<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Game extends Model
{
    /** @use HasFactory<\Database\Factories\GameFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'round_id',
        'is_active',
    ];

    /**
     * Get the round that owns the Game
     */
    public function round(): BelongsTo
    {
        return $this->belongsTo(Round::class);
    }

    /**
     * The participants that belong to the Game
     */
    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(Participant::class, 'game_participant')->withPivot(['is_correct', 'is_incorrect'])->withTimestamps();
    }
}
