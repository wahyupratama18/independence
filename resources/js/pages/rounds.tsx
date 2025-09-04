import { DataTable } from '@/components/data-table';
import InputError from '@/components/input-error';
import SideForm from '@/components/side-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Round, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Round',
        href: '/rounds',
    },
];

export default function DeptTable({rounds}: { rounds: Round[] }) {
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openReset, setOpenReset] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [round, setRound] = useState<Round | null>(null);

    const form = useForm<{
        name: string;
        correct_points: string;
        incorrect_points: string;
        last_members_kicked: string;
        is_knocked_out: boolean;
    }>({
        name: '',
        correct_points: '0',
        incorrect_points: '0',
        last_members_kicked: '0',
        is_knocked_out: false,
    })

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Round" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-end">
                    <Button onClick={() => {
                        setOpen(true);
                        setRound(null);
                        form.setData({
                            name: '',
                            correct_points: '0',
                            incorrect_points: '0',
                            last_members_kicked: '0',
                            is_knocked_out: false,
                        });
                        setTitle('Add Round');
                        setDescription('Fill in the details to add a new round.');
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
                            header: 'Name',
                        },
                        {
                            accessorKey: 'correct_points',
                            header: 'Correct Points',
                        },
                        {
                            accessorKey: 'incorrect_points',
                            header: 'Incorrect Points',
                        },
                        {
                            accessorKey: 'last_members_kicked',
                            header: 'Should kicked last dept member..',
                        },
                        {
                            accessorKey: 'is_knocked_out',
                            header: 'Is Knocked Out System',
                            cell: ({ row }) => (
                                <span className={row.original.is_knocked_out ? "text-green-600" : "text-red-600"}>
                                    {row.original.is_knocked_out ? 'true' : 'false'}
                                </span>
                            ),
                        },
                        {
                            accessorKey: 'options',
                            header: 'Options',
                            cell: ({ row }) => (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setOpen(true);
                                            setRound(row.original);
                                            form.setData({
                                                name: row.original.name,
                                                correct_points: String(row.original.correct_points),
                                                incorrect_points: String(row.original.incorrect_points),
                                                last_members_kicked: String(row.original.last_members_kicked),
                                                is_knocked_out: row.original.is_knocked_out,
                                            });
                                            setTitle('Edit Round');
                                            setDescription('Update the details of the round.');
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    { row.original.last_members_kicked > 0 &&
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setOpenReset(true);
                                                setRound(row.original);
                                            }}
                                        >
                                            Deactive Participants
                                        </Button>
                                    }
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            setOpenDialog(true);
                                            setRound(row.original);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ),
                        }
                    ]}
                    data={rounds}
                />

                <SideForm open={open} onClose={() => setOpen(false)} title={title} description={description} form={form} onSubmit={() => {
                    const action = round ? form.patch : form.post;

                    action(route(`rounds.${round ? 'update' : 'store'}`, round?.id), {
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
                        <Label htmlFor="correct_points">Correct Points</Label>

                        <Input
                            id="correct_points"
                            type='number'
                            name="correct_points"
                            placeholder="correct_points"
                            autoComplete="current-correct_points"
                            value={form.data.correct_points}
                            onChange={(e) => form.setData('correct_points', e.target.value)}
                        />

                        <InputError message={form.errors.correct_points} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="incorrect_points">Incorrect Points</Label>

                        <Input
                            id="incorrect_points"
                            type='number'
                            name="incorrect_points"
                            placeholder="incorrect_points"
                            autoComplete="current-incorrect_points"
                            value={form.data.incorrect_points}
                            onChange={(e) => form.setData('incorrect_points', e.target.value)}
                        />

                        <InputError message={form.errors.incorrect_points} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="last_members_kicked">Max Participants to The Next Stage</Label>

                        <Input
                            id="last_members_kicked"
                            type='number'
                            name="last_members_kicked"
                            placeholder="last_members_kicked"
                            autoComplete="current-last_members_kicked"
                            value={form.data.last_members_kicked}
                            onChange={(e) => form.setData('last_members_kicked', e.target.value)}
                        />

                        <InputError message={form.errors.incorrect_points} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="is_knocked_out"
                            name="is_knocked_out"
                            checked={form.data.is_knocked_out}
                            onClick={() => form.setData('is_knocked_out', ! form.data.is_knocked_out)}
                            tabIndex={3}
                        />
                        <Label htmlFor="is_knocked_out">Using Knocked Out</Label>
                    </div>
                </SideForm>

                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent>
                        <DialogTitle>Are you sure you want to delete this round?</DialogTitle>
                        <DialogDescription>
                            Once your round is deleted, all of its resources and data will also be permanently deleted.
                        </DialogDescription>
                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button type='button' variant="secondary" onClick={() => setOpenDialog(false)}>
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button variant="destructive" disabled={form.processing} onClick={() => {
                                form.delete(route(`rounds.destroy`, round?.id), {
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

                <Dialog open={openReset} onOpenChange={setOpenReset}>
                    <DialogContent>
                        <DialogTitle>Are you sure you want to continue to the next round from this?</DialogTitle>
                        <DialogDescription>
                            Once proceed, all participants will be reduced to {round?.last_members_kicked} and the rest will be deactivated.
                        </DialogDescription>
                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button type='button' variant="secondary" onClick={() => setOpenReset(false)}>
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button disabled={form.processing} onClick={() => {
                                form.put(route(`finished.update`, round?.id), {
                                    onSuccess: () => {
                                        setOpenReset(false);
                                    },
                                });
                            }}>
                                Continue
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
