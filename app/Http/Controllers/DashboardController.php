<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        $game = Game::query()
            ->with('round')
            ->where('is_active', true)
            ->first();

        return Inertia::render('dashboard', [
            'game' => $game,
            'participants' => $game?->participants()
                ->orderBy('order')
                ->with(['department', 'games.round'])
                ->get()
                ->toResourceCollection(),
        ]);
    }
}
