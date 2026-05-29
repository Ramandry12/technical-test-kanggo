import React, { useState } from "react";
import { type Task } from "../store/taskStore";
import { useTasks } from "../hooks/useTasks";
import { X, Save, AlertCircle } from "lucide-react";
import axios from "axios";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
}) => {
  const { createTask, updateTask } = useTasks();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"pending" | "in-progress" | "done">(
    "pending",
  );
  const [deadline, setDeadline] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [prevTaskToEdit, setPrevTaskToEdit] = useState<Task | null>(null);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  if (taskToEdit !== prevTaskToEdit || isOpen !== prevIsOpen) {
    setPrevTaskToEdit(taskToEdit);
    setPrevIsOpen(isOpen);

    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
      setStatus(taskToEdit.status);

      if (taskToEdit.deadline) {
        const d = new Date(taskToEdit.deadline);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        setDeadline(`${year}-${month}-${day}`);
      } else {
        setDeadline("");
      }
      setError(null);
    } else {
      setTitle("");
      setDescription("");
      setStatus("pending");
      setDeadline("");
      setError(null);
    }
  }

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim() === "") {
      setError("Judul tugas wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedDeadline = deadline === "" ? null : deadline;

      if (taskToEdit) {
        await updateTask(taskToEdit.id, {
          title,
          description: description.trim() === "" ? null : description,
          status,
          deadline: formattedDeadline,
        });
      } else {
        await createTask(
          title,
          description.trim() === "" ? null : description,
          status,
          formattedDeadline,
        );
      }
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Terjadi kesalahan saat menyimpan tugas.",
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan saat menyimpan tugas.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="glass w-full max-w-lg bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-slate-100">
            {taskToEdit ? "Ubah Tugas" : "Tambah Tugas Baru"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="flex items-center gap-2 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-medium">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Judul Tugas <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Misal: Menyelesaikan technical test..."
              className="px-4 py-2.5 bg-slate-800 border border-slate-700/60 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail tugas atau catatan tambahan..."
              rows={3}
              className="px-4 py-2.5 bg-slate-800 border border-slate-700/60 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Task["status"])}
                className="px-4 py-2.5 bg-slate-800 border border-slate-700/60 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Selesai</option>
              </select>
            </div>

            {/* Deadline */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tenggat (Deadline)
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="px-4 py-2.5 bg-slate-800 border border-slate-700/60 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 cursor-pointer"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-slate-800/60 mt-4 pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-850 border border-transparent transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-sm font-semibold tracking-wide shadow-md shadow-indigo-500/10 cursor-pointer transition-all hover:shadow-indigo-500/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Menyimpan..." : "Simpan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
