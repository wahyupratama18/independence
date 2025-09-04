import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Game, Participant, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { SelectInput } from '@/components/select-input';
import { ArrowUpDown, Check, CircleX } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Answer',
        href: '/answers',
    },
];

export default function Answers({games, participants}: { games: Game[], participants: Participant[] }) {
    const [game, setGame] = useState<Game | null>(null);

    const form = useForm<{
        participants: {
            id: number;
            is_correct: boolean;
            is_incorrect: boolean;
        }[];
    }>({
        participants: participants.map(participant => ({
            id: participant.id,
            is_correct: false,
            is_incorrect: false,
        })),
    })

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Game" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid grid-cols-12 gap-4">
                    <div className="grid gap-2 col-span-11">
                        <Label htmlFor="game_id">Game</Label>

                        <SelectInput
                            name="game_id"
                            options={games.map(game => ({
                                label: `${game.name} (${game.round.name})`,
                                value: game.id.toString(),
                            }))}
                            value={game?.id.toString() ?? undefined}
                            onChange={(value) => {
                                const newGame = games.find(g => g.id.toString() === value) ?? null
                                setGame(newGame);
                                form.setData('participants', participants.map(participant => ({
                                    id: participant.id,
                                    is_correct: newGame?.participants.some(p => p.id === participant.id && (p.pivot.is_correct/*  || participant.last_game_result */) && !p.pivot.is_incorrect) ?? true,
                                    is_incorrect: newGame?.participants.some(p => p.id === participant.id && (p.pivot.is_incorrect/*  || ! participant.last_game_result */) && !p.pivot.is_correct) ?? false,
                                })));
                            }}
                        />
                    </div>

                    {game &&
                        <div className="flex items-end w-full">
                            <Button className='w-full' onClick={() => {
                                form.patch(route('answers.update', game.id), {
                                    preserveScroll: true,
                                    onSuccess: () => {
                                        setGame(null);
                                        form.reset();
                                    }
                                });
                            }}>
                                Save
                            </Button>
                        </div>
                    }
                </div>

                {game && participants.length > 0 && (
                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                        {participants.map((participant, idx) => (
                            <Card key={participant.id}>
                                <CardHeader className="flex justify-between items-center mb-4">
                                    <span className="font-medium">{participant.name}</span>
                                    <span className="text-sm">{participant.order}</span>
                                </CardHeader>
                                <CardContent className="grid lg:grid-cols-2 gap-4 px-4 mt-auto">
                                    <Button
                                        type="button"
                                        className={`px-4 py-2 rounded ${form.data.participants[idx].is_correct ? 'bg-green-500 text-white hover:bg-green-600' : ''}`}
                                        onClick={() =>
                                            form.setData('participants', form.data.participants.map((p, i) =>
                                                i === idx
                                                    ? { ...p, is_correct: true, is_incorrect: false }
                                                    : p
                                            ))
                                        }
                                    >
                                        <Check />
                                    </Button>
                                    <Button
                                        type="button"
                                        className={`px-4 py-2 rounded ${form.data.participants[idx].is_incorrect ? 'bg-red-500 text-white hover:bg-red-600' : ''}`}
                                        onClick={() =>
                                            form.setData('participants', form.data.participants.map((p, i) =>
                                                i === idx
                                                    ? { ...p, is_correct: false, is_incorrect: true }
                                                    : p
                                            ))
                                        }
                                    >
                                        <CircleX />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
