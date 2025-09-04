<?php

namespace App\Http\Controllers;

use App\Events\GameScoreSaved;
use App\Http\Requests\UpdateAnswerRequest;
use App\Models\Game;
use App\Models\Participant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnswerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('answers', [
            'games' => Game::query()
                ->with(['participants', 'round'])
                ->get(),
            'participants' => Participant::query()
                ->orderBy('order')
                ->with(['department'])
                ->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Game $answer): JsonResponse
    {
        return response()->json([
            'game' => $answer->load('round'),
            'participants' => $answer->participants()
                ->orderBy('order')
                ->with(['department', 'games.round'])
                ->get()
                ->toResourceCollection(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Game $answer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAnswerRequest $request, Game $answer): RedirectResponse
    {
        $answer->is_active = true;
        $answer->save();

        // game other than this should be inactive
        Game::query()
            ->where('id', '!=', $answer->id)
            ->update(['is_active' => false]);

        $participants = collect($request->participants);

        $answer->participants()->sync(
            $participants->mapWithKeys(fn ($participant): array => [$participant['id'] => [
                'is_correct' => $participant['is_correct'],
                'is_incorrect' => $participant['is_incorrect'],
            ]])
        );

        $db = Participant::query()->find($participants->pluck('id'));

        Participant::upsert(
            $participants->map(fn ($participant): array => [
                'id' => $participant['id'],
                'name' => $db->find($participant['id'])->name ?? '',
                'department_id' => $db->find($participant['id'])->department_id ?? null,
                'last_game_result' => $participant['is_correct'],
                'deleted_at' => (
                    $answer->round->is_knocked_out &&
                    $participant['is_incorrect'] &&
                    $participants->where('is_incorrect', true)->count() < $participants->count()
                ) ? now() : null,
            ])->toArray(),
            ['id'],
            ['name', 'department_id', 'last_game_result', 'deleted_at']
        );

        GameScoreSaved::dispatch($answer);

        return redirect()->back()->with('success', 'Answers updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Game $answer)
    {
        //
    }
}
