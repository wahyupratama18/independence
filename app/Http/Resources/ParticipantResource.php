<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ParticipantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'department_id' => $this->department_id,
            'department' => $this->whenLoaded('department'),
            'order' => $this->order,
            'last_game_result' => $this->last_game_result,
            'pivot' => $this->whenPivotLoaded('game_participant', fn () => [
                'game_id' => $this->pivot->game_id,
                'participant_id' => $this->pivot->participant_id,
                'is_correct' => $this->pivot->is_correct,
                'is_incorrect' => $this->pivot->is_incorrect,
            ]),
            'result' => $this->result,
            'games' => $this->whenLoaded('games'),
            'deleted_at' => $this->deleted_at,
        ];
    }
}
