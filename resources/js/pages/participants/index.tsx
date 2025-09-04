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
        href: '/participants',
    },
];

export default function ParticipantsTable({participants, departments}: { participants: {data: Participant[]} , departments: Department[]}) {
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [restore, setRestore] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [participant, setParticipant] = useState<Participant | null>(null);

    const form = useForm<{
        name: string;
        department_id: number | null;
        order: number;
        restore: boolean;
    }>({
        name: '',
        department_id: null,
        order: 0,
        restore: false,
    })

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Participant" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-end">
                    <Button onClick={() => {
                        setOpen(true);
                        setParticipant(null);
                        form.setData({ name: '', order: 0, department_id: null, restore: false });
                        setTitle('Add Participant');
                        setDescription('Fill in the details to add a new participant.');
                    }}>Add</Button>
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
                            accessorKey: 'deleted_at',
                            header: SortableHeader('Knocked Out'),
                            cell: ({ row }) => row.original.deleted_at ? 'Yes' : 'No',
                        },
                        {
                            accessorKey: 'options',
                            header: 'Options',
                            cell: ({ row }) => (
                                <div className="flex gap-2">
                                    <Link href={route('participants.show', row.original.id)}>
                                        <Button>View</Button>
                                    </Link>

                                    { row.original.deleted_at ?
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                form.setData('restore', true);
                                                setRestore(true);
                                                setParticipant(row.original);
                                            }}
                                        >
                                            Restore
                                        </Button>
                                    : <Button
                                        variant="outline"
                                        onClick={() => {
                                            setOpen(true);
                                            setParticipant(row.original);
                                            form.setData({
                                                name: row.original.name,
                                                order: Number(row.original.order),
                                                department_id: row.original.department_id,
                                                restore: false,
                                            });
                                            setTitle('Edit Participant');
                                            setDescription('Update the details of the participant.');
                                        }}
                                    >
                                        Edit
                                    </Button> }

                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            form.setData('restore', false)

                                            setOpenDialog(true);
                                            setParticipant(row.original);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ),
                        }
                    ]}
                    data={participants.data}
                />

                <SideForm open={open} onClose={() => setOpen(false)} title={title} description={description} form={form} onSubmit={() => {
                    const action = participant ? form.patch : form.post;

                    action(route(`participants.${participant ? 'update' : 'store'}`, participant?.id), {
                        onSuccess: () => {
                            setOpen(false);
                            form.reset();
                        },
                    });
                }}>
                    {/* Form fields go here */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>

                        <Input
                            id="name"
                            name="name"
                            placeholder="name"
                            autoComplete="current-name"
                            value={form.data.name}
                            autoFocus
                            onChange={(e) => form.setData('name', e.target.value)}
                        />

                        <InputError message={form.errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="order">Order</Label>

                        <Input
                            id="order"
                            type='number'
                            name="order"
                            placeholder="order"
                            autoComplete="current-order"
                            value={form.data.order}
                            onChange={(e) => form.setData('order', parseInt(e.target.value))}
                        />

                        <InputError message={form.errors.order} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="department_id">Department</Label>

                        <SelectInput
                            name="department_id"
                            options={departments.map(department => ({
                                label: department.name,
                                value: department.id.toString(),
                            }))}
                            value={form.data.department_id?.toString()}
                            onChange={(value) => form.setData('department_id', value)}
                        />

                        <InputError message={form.errors.department_id} />
                    </div>
                </SideForm>

                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent>
                        <DialogTitle>Are you sure you want to delete this participant?</DialogTitle>
                        <DialogDescription>
                            Once your participant is deleted, all of its resources and data will also be permanently deleted.
                        </DialogDescription>
                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button type='button' variant="secondary" onClick={() => setOpenDialog(false)}>
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button variant="destructive" disabled={form.processing} onClick={() => {
                                form.delete(route(`participants.destroy`, participant?.id), {
                                    onSuccess: () => {
                                        setOpenDialog(false);
                                    },
                                });
                            }}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={restore} onOpenChange={setRestore}>
                    <DialogContent>
                        <DialogTitle>Are you sure you want to restore this participant?</DialogTitle>
                        <DialogDescription>
                            Once your participant is restored, all of its resources and data will also be restored.
                        </DialogDescription>
                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button type='button' variant="secondary" onClick={() => setRestore(false)}>
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button variant="destructive" disabled={form.processing} onClick={() => {
                                form.delete(route(`participants.destroy`, participant?.id), {
                                    preserveState: true,
                                    onSuccess: () => {
                                        setRestore(false);
                                    },
                                });
                            }}>
                                Restore
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
