"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sort, Status, Task } from "../../types";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../../services/api";
import dayjs from "dayjs";
import {
  FaPlus,
  FaCalendarAlt,
  FaRegTrashAlt,
  FaRegEdit,
} from "react-icons/fa";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskForm, setTaskForm] = useState({
    id: "",
    title: "",
    description: "",
    dueDate: "",
    status: Status.ToDo,
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(Status.ToDo);
  const [activeSort, setActiveSort] = useState(Sort.Ascending);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const loadTasks = async () => {
    const userTasks = await getTasks(activeSort);
    setTasks(userTasks.data);
  };

  const resetForm = () => {
    setTaskForm({
      id: "",
      title: "",
      description: "",
      dueDate: "",
      status: 0,
    });
    setIsEditing(false);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setTaskForm({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await updateTask(taskForm.id, {
          title: taskForm.title,
          description: taskForm.description,
          status: taskForm.status,
          dueDate: taskForm.dueDate,
        });
      } else {
        await createTask({
          title: taskForm.title,
          description: taskForm.description,
          status: taskForm.status,
          dueDate: taskForm.dueDate,
        });
      }
      closeModal();
      loadTasks();
    } catch {
      setError("Failed to save task");
    }
  };

  const handleUpdateStatus = async (taskId: string, status: Status) => {
    try {
      const request = {
        id: taskId,
        status,
      };

      await updateTaskStatus(request);
      loadTasks();
    } catch {
      setError("Failed to update task status");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      loadTasks();
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
      }
    } catch {
      setError("Failed to delete task");
    }
  };

  const handleSortTasks = async (sort: Sort) => {
    setActiveSort(sort);

    const userTasks = await getTasks(sort);

    setTasks(userTasks.data);
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === Status.ToDo) return task.status === Status.ToDo;
    if (activeTab === Status.InProgress)
      return task.status === Status.InProgress;
    if (activeTab === Status.Complete) return task.status === Status.Complete;
    return true;
  });

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  useEffect(() => {
    const currentUser = localStorage.getItem("authToken");
    if (!currentUser) {
      router.push("/login");
      return;
    }
    loadTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Nguyen Tan Thanh - Fullstack Developer - Task Management
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-4">
            {/* Filter by task status */}
            <div className="bg-white rounded-lg shadow p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab(Status.ToDo)}
                  className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === Status.ToDo
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Todo
                </button>
                <button
                  onClick={() => setActiveTab(Status.InProgress)}
                  className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === Status.InProgress
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setActiveTab(Status.Complete)}
                  className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === Status.Complete
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Completed
                </button>
              </nav>
            </div>
            {/* Sort by asc or desc */}
            <div className="bg-white rounded-lg shadow p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => handleSortTasks(Sort.Ascending)}
                  className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md ${
                    activeSort === Sort.Ascending
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Ascending
                </button>
                <button
                  onClick={() => handleSortTasks(Sort.Descending)}
                  className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md ${
                    activeSort === Sort.Descending
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Descending
                </button>
              </nav>
            </div>
          </aside>

          {/* Task Content */}
          <div className="flex-1">
            {/* Task List Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeTab === Status.ToDo && "Todo Tasks"}
                {activeTab === Status.InProgress && "Tasks In Progress"}
                {activeTab === Status.Complete && "Completed Tasks"}
              </h2>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 gap-2"
              >
                <FaPlus /> New Task
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}

            {/* Task List */}
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                  No tasks found
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                      task.status === Status.ToDo
                        ? "border-gray-300"
                        : task.status === Status.InProgress
                        ? "border-yellow-400"
                        : "border-green-500"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => setSelectedTask(task)}
                      >
                        <h3 className="text-base font-medium text-gray-900">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {task.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center text-sm text-gray-500 gap-2">
                          <FaCalendarAlt />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleUpdateStatus(task.id, Number(e.target.value))
                          }
                          className="text-sm rounded-md border-gray-300 shadow-sm text-gray-900"
                        >
                          <option value="0">Todo</option>
                          <option value="1">In Progress</option>
                          <option value="2">Completed</option>
                        </select>
                        <button
                          onClick={() => openEditModal(task)}
                          className="p-1 text-gray-400 hover:text-blue-500 "
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <FaRegTrashAlt />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Task Details Panel */}
          {selectedTask && (
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Task Details
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(selectedTask)}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedTask(null)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Title</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedTask.title}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Description
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedTask.description || "No description"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Due Date
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedTask.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Status
                    </h3>
                    <p className="mt-1 text-sm text-gray-900 capitalize">
                      {selectedTask.status == Status.ToDo
                        ? "Todo"
                        : selectedTask.status == Status.InProgress
                        ? "In Progress"
                        : "Done"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Task Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {isEditing ? "Edit Task" : "Create New Task"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmitTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-gray-900"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={dayjs(taskForm.dueDate).format("YYYY-MM-DD")}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={taskForm.status}
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        status: Number(e.target.value) as Status,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-gray-900"
                  >
                    <option value="0">Todo</option>
                    <option value="1">In Progress</option>
                    <option value="2">Done</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isEditing ? "Update Task" : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
