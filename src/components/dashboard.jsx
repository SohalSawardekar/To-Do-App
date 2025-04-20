"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { DataTable } from "./ui/data-table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";
import { columns } from "./columns";

// Separate Navbar into its own client component
const Navbar = () => {
  const handleLogout = async () => {
    console.log("logged out");
  };

  return (
    <div className="h-[5rem] bg-slate-400 flex justify-around items-center">
      <p className="text-3xl text-slate-800 font-bold">To Do List</p>
      <Button className="hover:cursor-pointer" onClick={() => handleLogout()}>
        LogOut
      </Button>
    </div>
  );
};

const Dashboard = () => {
  // Initialize state with null/empty values
  const [tasks, setTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  // Add mounting state to prevent hydration issues
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const dummyData = [
      {
        id: 1,
        title: "Buy Groceries",
        description: "Need to buy vegetables, fruits, and milk.",
        date: "2025-04-22",
        location: "Supermart",
        completed: true,
      },
      {
        id: 2,
        title: "Meeting with Bob",
        description: "Discuss the new project proposal.",
        date: "2025-04-23",
        location: "Office",
        completed: false,
      },
      {
        id: 3,
        title: "Dentist Appointment",
        description: "Check-up at 3 PM.",
        date: "2025-04-25",
        location: "Dental Clinic",
        completed: true,
      },
    ];

    setTasks(dummyData);
  }, []);

  // Prevent rendering until client-side hydration is complete
  if (!isMounted) {
    return null;
  }

  const handleAddTask = () => {
    setEditingTask(null);
    setOpenDialog(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setOpenDialog(true);
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your Tasks</h2>
          <Button onClick={handleAddTask} className={"hover:cursor-pointer"}>Add Task</Button>
        </div>
        <DataTable columns={columns} data={tasks} />
      </div>

      {openDialog && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTask ? "Edit Task" : "Add New Task"}
              </DialogTitle>
              <DialogDescription>
                <div className="text-muted-foreground text-sm">
                  <div className="flex flex-col gap-4">
                    <input
                      type="text"
                      placeholder="Task Title"
                      className="border rounded p-2"
                      value={editingTask?.title || ""}
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      className="border rounded p-2"
                      value={editingTask?.description || ""}
                    />
                    <input
                      type="date"
                      className="border rounded p-2"
                      value={editingTask?.date || ""}
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      className="border rounded p-2"
                      value={editingTask?.location || ""}
                    />
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setOpenDialog(false);
                }}
              >
                {editingTask ? "Save Changes" : "Add Task"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Dashboard;
