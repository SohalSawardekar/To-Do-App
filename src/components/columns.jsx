import { Button } from "./ui/button";

export const columns = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date");
      return date ? new Date(date).toLocaleDateString() : "No Date Set";
    },
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className={"hover:cursor-pointer"}>
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className={"hover:cursor-pointer"}
        >
          Delete
        </Button>
      </div>
    ),
  },
];
