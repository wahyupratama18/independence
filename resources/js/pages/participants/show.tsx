import { DataTable } from '@/components/data-table';
import InputError from '@/components/input-error';
import SideForm from '@/components/side-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Department, Participant, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { SelectInput } from '@/components/select-input';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SortableHeader } from '@/components/sortable-header';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Participant',
        href: '/participant',
    },
];

export default function ParticipantsTable({participant}: { participant: {data: Participant}}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Participant" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">

                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <span className="text-lg xl:text-2xl font-semibold">{participant.data.name}</span>
                        <span className="text-sm xl:text-lg text-muted-foreground">{participant.data.department?.name}</span>
                    </div>
                    <div className="bg-muted px-4 py-2 rounded-lg text-center min-w-[80px]">
                        <span className="text-xl xl:text-3xl font-bold">{participant.data.result?.score ?? '-'}</span>
                        <div className="text-xs xl:text-lg text-muted-foreground">Score</div>
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
                            cell: ({ row }) => `${row.original.name} (${row.original.round.name})`,
                        },
                        {
                            accessorKey: 'order',
                            header: 'Result',
                            cell: ({ row }) => {
                                const { is_correct, is_incorrect } = row.original.pivot;
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
                        {
                            accessorKey: 'score',
                            header: 'Score',
                            cell: ({ row }) =>
                                row.original.pivot.is_correct
                                    ? row.original.round.correct_points
                                    : row.original.pivot.is_incorrect ? row.original.round.incorrect_points : 0,
                        },
                    ]}
                    data={participant.data.games}
                />
            </div>
        </AppLayout>
    );
}
