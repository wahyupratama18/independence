<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\AnswerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\FinishedController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\RoundController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::apiResource('departments', DepartmentController::class);
    Route::apiResource('leaderboard', LeaderboardController::class)->only(['index']);
    Route::apiResource('participants', ParticipantController::class)->withTrashed(['show', 'destroy']);
    Route::apiResource('rounds', RoundController::class);
    Route::apiResource('finished', FinishedController::class)->only(['update']);
    Route::apiResource('games', GameController::class);
    Route::apiResource('answers', AnswerController::class)->only(['index', 'show', 'update']);
    Route::apiResource('analytics', AnalyticsController::class)->only(['index', 'store']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
