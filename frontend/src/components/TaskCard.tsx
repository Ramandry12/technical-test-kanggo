import React, { useState } from "react";
import { type Task } from "../store/taskStore";
import { useTasks } from "../hooks/useTasks";
import {
  Calendar,
  Edit3,
  Trash2,
  CheckCircle2,
  Play,
  AlertCircle,
} from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { updateTask, deleteTask } = useTasks();

  const handleStatusChange = async (
    newStatus: "pending" | "in-progress" | "done",
  ) => {
    await updateTask(task.id, { status: newStatus });
  };

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDelete = () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    setShowConfirmDelete(false);
    await deleteTask(task.id);
  };

  const formatDeadline = (dateStr: string | null) => {
    if (!dateStr) return "Tanpa Tenggat";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDeadlineStatus = () => {
    if (!task.deadline || task.status === "done") return "normal";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(task.deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    if (deadlineDate < today) {
      return "overdue"; // Red warning
    } else if (deadlineDate.getTime() === today.getTime()) {
      return "today"; // Orange warning
    }
    return "normal";
  };

  const deadlineStatus = getDeadlineStatus();

  const statusBadges = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "in-progress": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    done: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  const statusLabel = {
    pending: "Pending",
    "in-progress": "In Progress",
    done: "Selesai",
  };

  return (
    <div className="glass bg-slate-800/10 hover:bg-slate-800/30 border border-slate-700/40 hover:border-slate-600/50 rounded-2xl p-5 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex flex-col gap-3">
        {/* Status Badge & Quick Controls */}
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusBadges[task.status]}`}
          >
            {statusLabel[task.status]}
          </span>

          <div className="flex items-center gap-1">
            {task.status !== "done" && (
              <>
                {task.status === "pending" && (
                  <button
                    onClick={() => handleStatusChange("in-progress")}
                    title="Mulai Tugas"
                    className="p-1 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleStatusChange("done")}
                  title="Tandai Selesai"
                  className="p-1 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="flex flex-col gap-1.5">
          <h3 className="font-heading text-lg font-bold text-slate-100 line-clamp-1">
            {task.title}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2 min-h-[40px] leading-relaxed">
            {task.description || (
              <span className="italic text-slate-500/80">
                Tidak ada deskripsi.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Footer Meta & Actions */}
      <div className="border-t border-slate-700/50 mt-4 pt-4 flex items-center justify-between">
        {/* Dynamic Deadline Label */}
        <div className="flex items-center gap-1.5 text-xs font-medium">
          {deadlineStatus === "overdue" && (
            <div className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Terlambat! ({formatDeadline(task.deadline)})</span>
            </div>
          )}
          {deadlineStatus === "today" && (
            <div className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Hari Ini! ({formatDeadline(task.deadline)})</span>
            </div>
          )}
          {deadlineStatus === "normal" && (
            <div className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDeadline(task.deadline)}</span>
            </div>
          )}
        </div>

        {/* CRUD Actions */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onEdit(task)}
            title="Edit Tugas"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/10 transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            title="Hapus Tugas"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/10 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Custom Confirmation Modal for deletion */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="glass w-full max-w-sm bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 animate-slide-up">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-100">
                Hapus Tugas?
              </h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Apakah Anda yakin ingin menghapus tugas{" "}
              <span className="font-bold text-slate-200">{task.title}</span>?
            </p>
            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-rose-600/10 hover:shadow-rose-600/20 transition-all cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
