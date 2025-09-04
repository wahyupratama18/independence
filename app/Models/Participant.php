<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Participant extends Model
{
    /** @use HasFactory<\Database\Factories\ParticipantFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'order',
        'department_id',
    ];

    /**
     * Get the department that owns the Participant
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * The games that belong to the Participant
     */
    public function games(): BelongsToMany
    {
        return $this->belongsToMany(Game::class, 'game_participant')->withPivot(['is_correct', 'is_incorrect'])->withTimestamps();
    }

    public function result(): Attribute
    {
        return Attribute::make(
            get: fn () => (object) ($this->relationLoaded('games') ? [
                'correct' => $this->games->filter(fn ($game) => $game->pivot && $game->pivot->is_correct)->count(),
                'incorrect' => $this->games->filter(fn ($game) => $game->pivot && $game->pivot->is_incorrect)->count(),
                'score' => $this->games->sum(
                    fn (Game $game) => match (true) {
                        (bool) $game->pivot->is_correct => $game->round->correct_points,
                        (bool) $game->pivot->is_incorrect => $game->round->incorrect_points,
                        default => 0,
                    }
                ),
            ] : [
                'correct' => 0,
                'incorrect' => 0,
                'score' => 0,
            ]),
        );
    }
}
