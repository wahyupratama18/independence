import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerForm,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface BaseForm {
  validating?: boolean;
  hasErrors?: boolean;
  processing?: boolean;
//   errors: Record<string, string[]>;
  clearErrors: () => void;
}

interface SideFormProps<TForm extends BaseForm = BaseForm> {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string;
    form: TForm;
    onSubmit: () => void;
    children: React.ReactNode;
}

export default function SideForm({ open, onClose, title, description, form, onSubmit, children }: SideFormProps) {
    return (
        <Drawer modal snapPoints={[]} open={open} onOpenChange={onClose} direction="right">
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>{description}</DrawerDescription>
                </DrawerHeader>
                <DrawerForm onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}>
                    {/* {form.validating && <Loading text="Validating..." /> } */}

                    {children}
                </DrawerForm>
                <DrawerFooter>
                    {/* Submit */}
                    <Button onClick={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }} disabled={form.hasErrors || form.processing}>{'Save'}</Button>

                    <Button variant="outline" onClick={onClose}>
                        {'Cancel'}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
