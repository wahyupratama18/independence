import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Game, Participant, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { SelectInput } from '@/components/select-input';
import { ArrowUpDown, Check, CircleX } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import axios from 'axios';
import { DataTable } from '@/components/data-table';
import { SortableHeader } from '@/components/sortable-header';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Analytics',
        href: '/analytics',
    },
];

export default function Analytics({games}: { games: Game[]}) {
    const [searchGames, setSearchGames] = useState<string[]>(games.map(game => game.id.toString()));
    const [participants, setParticipants] = useState<Participant[]>([]);

    const search = async () => {
        const response = await axios.post('/analytics', {
            games: searchGames
        });
        setParticipants(response.data.data);
    };

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
                            isMulti={true}
                            value={searchGames}
                            onChange={(value) => {
                                setSearchGames(Array.isArray(value) ? value : [value])
                            }}
                        />
                    </div>

                    <div className="flex items-center w-full">
                        <Button className='w-full' onClick={search}>
                            Search
                        </Button>
                    </div>
                </div>

                <DataTable
                    columns={[
                        {
                            accessorKey: 'id',
                            header: 'ID',
                        },
                        {
                            accessorKey: 'name',
                            header: SortableHeader('Name'),
                        },
                        {
                            accessorKey: 'department.name',
                            header: SortableHeader('Department Name'),
                        },
                        {
                            accessorKey: 'order',
                            header: SortableHeader('Order'),
                        },
                        {
                            accessorKey: 'result.score',
                            header: SortableHeader('Score'),
                        },
                        {
                            accessorKey: 'detail',
                            header: SortableHeader('Details'),
                            cell: ({ row }) => (
                                <ol className="list-disc pl-5">
                                    {row.original.games.map((item, index) => (
                                        <li
                                            key={index}
                                            className={
                                                item.pivot.is_correct
                                                    ? 'text-green-600'
                                                    : item.pivot.is_incorrect
                                                    ? 'text-red-600'
                                                    : 'text-gray-500'
                                            }
                                        >
                                            {item.name} ({item.round.name}):{' '}
                                            {item.pivot.is_correct ? 'Correct' : ''}
                                            {item.pivot.is_incorrect ? 'Incorrect' : ''}
                                            {item.pivot.is_correct || item.pivot.is_incorrect ? '' : 'Unanswered'}
                                        </li>
                                    ))}
                                </ol>
                            ),
                        },
                    ]}
                    data={participants}
                />
            </div>
        </AppLayout>
    );
}
