import React, { useEffect, useState } from "react";
import { type Task } from "../store/taskStore";
import { useTasks } from "../hooks/useTasks";
import Navbar from "../components/Navbar";
import Stats from "../components/Stats";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import {
  Plus,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Loader2,
} from "lucide-react";

/**
 * Main Tasks Management Dashboard Page.
 */
const Dashboard: React.FC = () => {
  const {
    tasks,
    meta,
    filters,
    isLoading,
    fetchTasks,
    setFilters,
    resetFilters,
  } = useTasks();

  const [searchInput, setSearchInput] = useState(filters.search);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const isSearching = searchInput !== filters.search || isLoading;

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters({ search: searchInput });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, setFilters, filters.search]);

  const [prevSearchFilter, setPrevSearchFilter] = useState(filters.search);

  if (filters.search !== prevSearchFilter) {
    setPrevSearchFilter(filters.search);
    setSearchInput(filters.search);
  }

  const handleCreateClick = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    if (meta && newPage >= 1 && newPage <= meta.totalPages) {
      setFilters({ page: newPage });
    }
  };

  const statusFilters = [
    { value: "all", label: "Semua" },
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "Dalam Proses" },
    { value: "done", label: "Selesai" },
  ];

  return (
    <div className="flex-grow flex flex-col pb-12 bg-slate-950 min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-6 flex flex-col gap-6 mt-6">
        {/* Statistics panel */}
        <Stats tasks={tasks} totalFromMeta={meta?.totalItems} />

        {/* Filter & Search Dashboard Toolbar */}
        <div className="glass p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          {/* Live Search & Refresh */}
          <div className="flex items-center gap-3 flex-grow max-w-md w-full">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari tugas berdasarkan judul..."
                className="w-full pl-10 pr-10 py-2 bg-slate-800 border border-slate-700/60 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {isSearching && (
                <Loader2 className="w-4 h-4 text-indigo-400 absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin" />
              )}
            </div>
            <button
              onClick={() => fetchTasks()}
              title="Refresh Data"
              disabled={isLoading}
              className="p-2.5 bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-slate-100 hover:bg-slate-700 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          {/* Status filter tabs & Create button */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status tabs */}
            <div className="bg-slate-850 border border-slate-700/60 p-1 rounded-xl flex items-center gap-1">
              {statusFilters.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilters({ status: tab.value })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    filters.status === tab.value
                      ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Create trigger */}
            <button
              onClick={handleCreateClick}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Tugas</span>
            </button>
          </div>
        </div>

        {/* Task Grid lists */}
        {isLoading && tasks.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="glass bg-slate-800/10 border border-slate-850 rounded-2xl p-5 h-44 flex flex-col justify-between"
              >
                <div className="flex flex-col gap-3">
                  <div className="w-16 h-5 bg-slate-800 rounded-full" />
                  <div className="w-3/4 h-6 bg-slate-850 rounded-lg" />
                  <div className="w-full h-4 bg-slate-850 rounded-lg" />
                </div>
                <div className="w-full h-8 bg-slate-800 border-t border-slate-850 pt-2 flex items-center justify-between" />
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="glass border border-slate-850 rounded-3xl p-12 flex flex-col items-center justify-center text-center gap-4 shadow-inner min-h-[350px] animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-500">
              <Inbox className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="flex flex-col gap-1 max-w-sm">
              <h3 className="font-heading text-lg font-bold text-slate-200">
                Tidak Ada Tugas Ditemukan
              </h3>
              <p className="text-sm text-slate-400">
                {searchInput.trim() !== ""
                  ? "Tidak ada tugas yang cocok dengan kata kunci pencarian Anda."
                  : "Daftar tugas Anda masih kosong. Silakan buat tugas baru sekarang!"}
              </p>
            </div>
            {searchInput.trim() !== "" && (
              <button
                onClick={resetFilters}
                className="mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
              >
                Reset Filter & Pencarian
              </button>
            )}
          </div>
        ) : (
          /* Task Grid Cards */
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in transition-opacity duration-300 ${isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
          >
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={handleEditClick} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta && (
          <div className="flex items-center justify-between mt-6 glass px-5 py-3 border border-slate-850 rounded-2xl shadow-md animate-fade-in">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700/60 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 hover:text-slate-100 rounded-xl text-xs font-bold tracking-wide transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Halaman {meta.currentPage} dari {meta.totalPages || 1}
            </span>

            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={
                filters.page === meta.totalPages || meta.totalPages <= 1
              }
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700/60 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 hover:text-slate-100 rounded-xl text-xs font-bold tracking-wide transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* Task create update */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default Dashboard;
