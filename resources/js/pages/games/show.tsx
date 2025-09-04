import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Game, type BreadcrumbItem, Participant } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { SortableHeader } from '@/components/sortable-header';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Game',
        href: '/game',
    },
];

export default function GamesScore({game, participants}: { game: Game, participants: Participant[]}) {
    console.log(participants)
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Game" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Card className="mb-6">
                    <CardContent className="flex flex-col gap-2">
                        <div>
                            <span className="font-semibold">Name:</span> {game.name}
                        </div>
                        <div>
                            <span className="font-semibold">Round:</span> {game.round?.name ?? 'N/A'}
                        </div>
                        <div>
                            <span className="font-semibold">Total Participants:</span> {participants?.length ?? 0}
                        </div>
                    </CardContent>
                </Card>

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
                            header: SortableHeader('Department'),
                        },
                        {
                            accessorKey: 'pivot',
                            header: SortableHeader('Result'),
                            cell: ({ row }) => {
                                const { is_correct, is_incorrect } = row.original.games[0]?.pivot || {};
                                let text = "No score yet";
                                let color = "text-muted-foreground";

                                if (is_correct) {
                                    text = "Correct";
                                    color = "text-green-600 font-semibold";
                                } else if (is_incorrect) {
                                    text = "Incorrect";
                                    color = "text-red-600 font-semibold";
                                }
                                return <span className={color}>{text}</span>;
                            }
                        },
                    ]}
                    data={participants}
                />
            </div>
        </AppLayout>
    );
}
