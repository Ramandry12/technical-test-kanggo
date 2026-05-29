import { useTaskStore } from "../store/taskStore";

export const useTasks = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const meta = useTaskStore((state) => state.meta);
  const filters = useTaskStore((state) => state.filters);
  const isLoading = useTaskStore((state) => state.isLoading);
  const error = useTaskStore((state) => state.error);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const createTask = useTaskStore((state) => state.createTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const setFilters = useTaskStore((state) => state.setFilters);
  const resetFilters = useTaskStore((state) => state.resetFilters);

  return {
    tasks,
    meta,
    filters,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setFilters,
    resetFilters,
  };
};
