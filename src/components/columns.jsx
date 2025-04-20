import { Button } from "./ui/button";
import React from "react";

export const columns = (
  handleEditTask,
  handleDeleteTask,
  handleToggleStatus
) => [
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
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const task = row.original;
      return (
        <span
          className={`px-2 py-1 rounded-full text-white text-sm ${
            task.completed ? "bg-green-500" : "bg-yellow-500"
          }`}
        >
          {task.completed ? "Completed" : "Pending"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const task = row.original;
      return (
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleEditTask(task)}>
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDeleteTask(task.id)}
          >
            Delete
          </Button>
          <Button onClick={() => handleToggleStatus(task.id)}>
            {task.completed ? "Mark Pending" : "Mark Done"}
          </Button>
        </div>
      );
    },
  },
];
