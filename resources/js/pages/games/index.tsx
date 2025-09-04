import { DataTable } from '@/components/data-table';
import InputError from '@/components/input-error';
import SideForm from '@/components/side-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Round, Game, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { SelectInput } from '@/components/select-input';
import { ArrowUpDown } from 'lucide-react';
import { SortableHeader } from '@/components/sortable-header';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Game',
        href: '/games',
    },
];

export default function GamesTable({games, rounds}: { games: Game[] , rounds: Round[]}) {
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [game, setGame] = useState<Game | null>(null);

    const form = useForm<{
        name: string;
        round_id: number | null;
    }>({
        name: '',
        round_id: null,
    })

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Game" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-end">
                    <Button onClick={() => {
                        setOpen(true);
                        setGame(null);
                        form.setData({ name: '', round_id: null });
                        setTitle('Add Game');
                        setDescription('Fill in the details to add a new game.');
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
                            header: SortableHeader('Name')
                        },
                        {
                            accessorKey: 'round.name',
                            header: SortableHeader('Round Name'),
                        },
                        {
                            accessorKey: 'options',
                            header: 'Options',
                            cell: ({ row }) => (
                                <div className="flex gap-2">
                                    <Link href={route('games.show', row.original.id)}>
                                        <Button>View</Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setOpen(true);
                                            setGame(row.original);
                                            form.setData({
                                                name: row.original.name,
                                                round_id: row.original.round_id,
                                            });
                                            setTitle('Edit Game');
                                            setDescription('Update the details of the game.');
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            setOpenDialog(true);
                                            setGame(row.original);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ),
                        }
                    ]}
                    data={games}
                />

                <SideForm open={open} onClose={() => setOpen(false)} title={title} description={description} form={form} onSubmit={() => {
                    const action = game ? form.patch : form.post;

                    action(route(`games.${game ? 'update' : 'store'}`, game?.id), {
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
                        <Label htmlFor="round_id">Round</Label>

                        <SelectInput
                            name="round_id"
                            options={rounds.map(round => ({
                                label: round.name,
                                value: round.id.toString(),
                            }))}
                            value={form.data.round_id?.toString()}
                            onChange={(value) => form.setData('round_id', value)}
                        />

                        <InputError message={form.errors.round_id} />
                    </div>
                </SideForm>

                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent>
                        <DialogTitle>Are you sure you want to delete this game?</DialogTitle>
                        <DialogDescription>
                            Once your game is deleted, all of its resources and data will also be permanently deleted.
                        </DialogDescription>
                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button type='button' variant="secondary" onClick={() =>setOpenDialog(false)}>
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button variant="destructive" disabled={form.processing} onClick={() => {
                                form.delete(route(`games.destroy`, game?.id), {
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
            </div>
        </AppLayout>
    );
}
