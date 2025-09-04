import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";
import { Column } from "@tanstack/react-table";

// Reusable function for sortable column headers
export function SortableHeader<TData = unknown, TValue = unknown>(title: string) {
    return ({ column }: { column: Column<TData, TValue> }) => {
        const sortDirection = column.getIsSorted();
        return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                {title}
                {sortDirection === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                {sortDirection === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                {!sortDirection && <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
        );
    };
}
