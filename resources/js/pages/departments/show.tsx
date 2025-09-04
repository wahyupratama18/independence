import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Department, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { SortableHeader } from '@/components/sortable-header';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Department',
        href: '/department',
    },
];

export default function ParticipantsTable({department}: { department: {data: Department}}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Department" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">

                <div className="flex items-center justify-between mb-4">
                    <span className="text-lg xl:text-2xl font-semibold">{department.data.name}</span>
                    <div
                        className="px-4 py-2 aspect-square rounded-lg text-center min-w-[80px] flex flex-col items-center"
                        style={{
                            background: `${department.data.color ?? '#ccc'}`,
                        }}
                        />
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
                            accessorKey: 'result.score',
                            header: SortableHeader('Score'),
                        },
                        {
                            accessorKey: 'options',
                            header: 'Options',
                            cell: ({ row }) => (
                                <Link href={route('participants.show', row.original.id)}>
                                    <Button>View</Button>
                                </Link>
                            ),
                        }
                    ]}
                    data={department.data.participants}
                />
            </div>
        </AppLayout>
    );
}
