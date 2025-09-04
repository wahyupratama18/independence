<?php

namespace App\Http\Controllers;

use App\Events\FinishedRound;
use App\Models\Participant;
use App\Models\Round;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class FinishedController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function show(Round $finished)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Round $finished)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Round $finished)
    {
        Gate::authorize('update', $finished);

        $participants = Participant::query()
            // ->withTrashed()
            ->withWhereHas('games.round')
            ->get();

        // Group participants by department
        $grouped = $participants->groupBy('department_id');

        $toDelete = collect();

        foreach ($grouped as $departmentParticipants) {
            // Sort by score ascending (least score first)
            $sorted = $departmentParticipants->sortBy(fn (Participant $participant) => $participant->result->score)->values();

            // Get the last N participants in this department to delete
            $lastToKick = $sorted->take($finished->last_members_kicked);

            $toDelete = $toDelete->merge($lastToKick);
        }

        Participant::whereIn('id', $toDelete->pluck('id'))->delete();

        FinishedRound::dispatch($finished);

        return redirect()->back()->with('success', 'Round has been finished and participants have been updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Round $finished)
    {
        //
    }
}
