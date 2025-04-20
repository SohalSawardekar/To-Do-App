"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { DataTable } from "./ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";
import { columns } from "./columns";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

// Navbar Component
const Navbar = () => {
  const router = useRouter();
  const session = useSession();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="h-[5rem] bg-slate-400 flex justify-around items-center">
      <p className="text-3xl text-slate-800 font-bold">To Do List</p>
      <Button className="hover:cursor-pointer" onClick={handleLogout}>
        LogOut
      </Button>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const user = session?.user;
    const fetchTasks = async () => {
      try {
        if (user) {
          const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (error) throw error;
          setTasks(data || []);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsMounted(true);
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [supabase, session]);

  if (!isMounted) return <Loading />;

  const handleAddTask = () => {
    setEditingTask(null);
    setFormState({ title: "", description: "", date: "", location: "" });
    setOpenDialog(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormState({
      title: task.title || "",
      description: task.description || "",
      date: task.date || "",
      location: task.location || "",
    });
    setOpenDialog(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);
      if (error) throw error;
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const user = session?.user;
      if (!user) {
        console.error("User not found during submit.");
        return;
      }

      if (editingTask) {
        const { error } = await supabase
          .from("tasks")
          .update({
            title: formData.title,
            description: formData.description,
            date: formData.date,
            location: formData.location,
          })
          .eq("id", editingTask.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("tasks").insert([
          {
            user_id: user.id,
            title: formData.title,
            description: formData.description,
            date: formData.date,
            location: formData.location,
            completed: false,
          },
        ]);

        if (error) throw error;
      }

      // Refresh tasks
      const { data, error: refreshError } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (refreshError) throw refreshError;

      setTasks(data || []);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleToggleStatus = async (taskId) => {
    try {
      // Get the current task and its status first
      const currentTask = tasks.find((task) => task.id === taskId);
      const currentStatus = currentTask.completed;

      const { error } = await supabase
        .from("tasks")
        .update({ completed: !currentStatus })
        .eq("id", taskId);

      if (error) {
        console.error("Error updating task status:", error.message);
        throw error;
      }

      // Update the task list to reflect the changes
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: !currentStatus } : task
        )
      );
    } catch (error) {
      console.error("Error caught in handleToggleStatus:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto w-full">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Your Tasks</h2>
              <Button onClick={handleAddTask}>Add Task</Button>
            </div>
            <DataTable
              columns={columns(
                handleEditTask,
                handleDeleteTask,
                handleToggleStatus
              )}
              data={tasks}
            />
          </>
        )}
      </div>

      {/* Dialog for Add/Edit Task */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Add New Task"}
            </DialogTitle>
            <DialogDescription asChild>
              <form className="flex flex-col gap-4 mt-4">
                <input
                  type="text"
                  placeholder="Task Title"
                  className="border rounded p-2"
                  value={formState.title}
                  onChange={(e) =>
                    setFormState({ ...formState, title: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="border rounded p-2"
                  value={formState.description}
                  onChange={(e) =>
                    setFormState({ ...formState, description: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="border rounded p-2"
                  value={formState.date}
                  onChange={(e) =>
                    setFormState({ ...formState, date: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="border rounded p-2"
                  value={formState.location}
                  onChange={(e) =>
                    setFormState({ ...formState, location: e.target.value })
                  }
                />
              </form>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleSubmit(formState)}>
              {editingTask ? "Save Changes" : "Add Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboard;
