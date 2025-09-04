import { DataTable } from '@/components/data-table';
import InputError from '@/components/input-error';
import SideForm from '@/components/side-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Department, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { SortableHeader } from '@/components/sortable-header';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Department',
        href: '/departments',
    },
];

export default function DeptTable({departments}: { departments: { data: Department[] }}) {
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [department, setDepartment] = useState<Department | null>(null);

    const form = useForm({
        name: '',
        color: '',
    })

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Department" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-end">
                    <Button onClick={() => {
                        setOpen(true);
                        setDepartment(null);
                        form.setData({ name: '', color: '' });
                        setTitle('Add Department');
                        setDescription('Fill in the details to add a new department.');
                    }}>Add</Button>
                </div>

                <DataTable columns={[
                        {
                            accessorKey: 'id',
                            header: SortableHeader('ID'),
                        },
                        {
                            accessorKey: 'name',
                            header: SortableHeader('Name'),
                        },
                        {
                            accessorKey: 'participants_count',
                            header: SortableHeader('Total Participants'),
                        },
                        {
                            accessorKey: 'department_score',
                            header: SortableHeader('Total Score'),
                        },
                        {
                            accessorKey: 'color',
                            header: 'Color',
                            cell: ({ row }) => (
                                <div
                                    className="h-8 w-16 rounded"
                                    style={{ backgroundColor: row.original.color }}
                                />
                            ),
                        },
                        {
                            accessorKey: 'options',
                            header: 'Options',
                            cell: ({ row }) => (
                                <div className="flex gap-2">
                                    <Link href={route('departments.show', row.original.id)}>
                                        <Button>View</Button>
                                    </Link>

                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setOpen(true);
                                            setDepartment(row.original);
                                            form.setData({
                                                name: row.original.name,
                                                color: row.original.color,
                                            });
                                            setTitle('Edit Department');
                                            setDescription('Update the details of the department.');
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            setOpenDialog(true);
                                            setDepartment(row.original);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ),
                        }
                    ]}
                    data={departments.data}
                />

                <SideForm open={open} onClose={() => setOpen(false)} title={title} description={description} form={form} onSubmit={() => {
                    const action = department ? form.patch : form.post;

                    action(route(`departments.${department ? 'update' : 'store'}`, department?.id), {
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
                        <Label htmlFor="color">Color</Label>

                        <Input
                            id="color"
                            type='color'
                            name="color"
                            placeholder="color"
                            autoComplete="current-color"
                            value={form.data.color}
                            onChange={(e) => form.setData('color', e.target.value)}
                        />

                        <InputError message={form.errors.color} />
                    </div>
                </SideForm>

                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent>
                        <DialogTitle>Are you sure you want to delete this department?</DialogTitle>
                        <DialogDescription>
                            Once your department is deleted, all of its resources and data will also be permanently deleted.
                        </DialogDescription>
                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button type='button' variant="secondary" onClick={() =>setOpenDialog(false)}>
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button variant="destructive" disabled={form.processing} onClick={() => {
                                form.delete(route(`departments.destroy`, department?.id), {
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
