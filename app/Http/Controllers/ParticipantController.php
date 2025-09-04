<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreParticipantRequest;
use App\Http\Requests\UpdateParticipantRequest;
use App\Models\Department;
use App\Models\Participant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('participants/index', [
            'participants' => Participant::query()->with(['department', 'games.round'])
                ->orderBy('order')
                ->withTrashed()
                ->get()
                ->toResourceCollection(),
            'departments' => Department::query()->get(),
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
    public function store(StoreParticipantRequest $request): RedirectResponse
    {
        Participant::query()->create($request->validated());

        return redirect()->route('participants.index')->with('success', 'Participant created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Participant $participant): Response
    {
        return Inertia::render('participants/show', [
            'participant' => $participant->load(['department', 'games.round'])->toResource(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Participant $participant)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateParticipantRequest $request, Participant $participant): RedirectResponse
    {
        $participant->update($request->validated());

        return redirect()->route('participants.index')->with('success', 'Participant updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Participant $participant): RedirectResponse
    {
        Gate::authorize('delete', $participant);

        match (true) {
            $participant->trashed() && request('restore') => $participant->restore(),
            $participant->trashed() => $participant->forceDelete(),
            default => $participant->delete(),
        };

        $message = request('restore')
            ? 'Participant restored successfully.'
            : 'Participant deleted successfully.';

        return redirect()->route('participants.index')->with('success', $message);
    }
}
