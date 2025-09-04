<?php

namespace App\Http\Requests;

use App\Models\Round;
use Illuminate\Foundation\Http\FormRequest;

class StoreRoundRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Round::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'correct_points' => ['required', 'integer'],
            'incorrect_points' => ['required', 'integer'],
            'last_members_kicked' => ['required', 'integer'],
            'is_knocked_out' => ['required', 'boolean'],
        ];
    }
}
