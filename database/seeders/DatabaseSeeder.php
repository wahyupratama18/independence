<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Game;
use App\Models\Participant;
use App\Models\Round;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Admin',
        //     'email' => 'admin@wipro-unza.co.id',
        // ]);

        // Department::query()->upsert([
        //     ['name' => 'Finance & Accounting', 'color' => '#F57F2A'],
        //     ['name' => 'HR & GA', 'color' => '#6DC24B'],
        //     ['name' => 'IT', 'color' => '#FFCD2E'],
        //     ['name' => 'Marketing', 'color' => '#099487'],
        //     ['name' => 'R & D', 'color' => '#307A21'],
        //     ['name' => 'Sales', 'color' => '#C4515C'],
        //     // ['name' => 'Skincare', 'color' => '#4C7FBB'],
        // ], 'name', ['color']);

        // Department::query()->get()->each(fn ($department) => Participant::factory()
        //     ->count(5)
        //     ->create(['department_id' => $department->id])
        // );

        // Round::query()->upsert([
        //     ['name' => 'Semester 1', 'correct_points' => 10, 'incorrect_points' => -5, 'last_members_kicked' => 1, 'is_knocked_out' => false],
        //     ['name' => 'Semester 2', 'correct_points' => 10, 'incorrect_points' => -5, 'last_members_kicked' => 2, 'is_knocked_out' => false],
        //     ['name' => 'UAS', 'correct_points' => 0, 'incorrect_points' => 0, 'last_members_kicked' => 0, 'is_knocked_out' => true],
        // ], 'name', ['correct_points', 'incorrect_points', 'last_members_kicked', 'is_knocked_out']);

        $participants = Participant::query()->pluck('id');

        collect(range(1, 10))->each(function ($i) use ($participants) {
            $game = Game::factory()->create([
                'name' => $i,
                'round_id' => 3,
            ]);

            $game->participants()->sync(
                $participants->mapWithKeys(fn ($id) => [$id => [
                    // 'is_correct' => $c = (bool) random_int(0, 1),
                    // 'is_incorrect' => ! $c,
                ]])->toArray()
            );
        });
    }
}
