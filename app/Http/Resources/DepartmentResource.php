<?php

namespace App\Http\Resources;

use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepartmentResource extends JsonResource
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
            'color' => $this->color,
            'participants' => $this->whenLoaded('participants', fn () => $this->participants->toResourceCollection()),
            'participants_count' => $this->participants_count,
            'department_score' => $this->whenLoaded(
                'participants',
                fn () => $this->participants->sum(fn (Participant $participant) => $participant->result->score),
                0,
            ),
        ];
    }
}
