<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoundRequest;
use App\Http\Requests\UpdateRoundRequest;
use App\Models\Round;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class RoundController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('rounds', [
            'rounds' => Round::query()->get(),
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
    public function store(StoreRoundRequest $request): RedirectResponse
    {
        Round::query()->create($request->validated());

        return redirect()->route('rounds.index')->with('success', 'Round created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Round $round)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Round $round)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoundRequest $request, Round $round): RedirectResponse
    {
        $round->update($request->validated());

        return redirect()->route('rounds.index')->with('success', 'Round updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Round $round): RedirectResponse
    {
        Gate::authorize('delete', $round);

        $round->delete();

        return redirect()->route('rounds.index')->with('success', 'Round deleted successfully.');
    }
}
