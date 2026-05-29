import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { CreateTaskInput, UpdateTaskInput } from "../validators/taskValidator";
import * as taskService from "../services/taskService";

const formatTask = (task: any) => {
  if (task.status === "in_progress") {
    return { ...task, status: "in-progress" };
  }
  return task;
};

export const getTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { status, search, page, limit } = req.query;

    const result = await taskService.getAllTasks(userId, {
      status: status as string,
      search: search as string,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      message: "Daftar tugas berhasil diambil.",
      data: result.tasks.map(formatTask),
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new task for the authenticated user.
 * POST /api/tasks
 */
export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const input = req.body as CreateTaskInput;

    const task = await taskService.createTask(userId, input);

    res.status(201).json({
      success: true,
      message: "Tugas berhasil dibuat.",
      data: formatTask(task),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing task.
 * PUT /api/tasks/:id
 */
export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const taskId = parseInt(req.params.id as string, 10);

    if (isNaN(taskId)) {
      res.status(400).json({
        success: false,
        message: "ID tugas tidak valid.",
      });
      return;
    }

    const input = req.body as UpdateTaskInput;
    const updatedTask = await taskService.updateTask(userId, taskId, input);

    res.status(200).json({
      success: true,
      message: "Tugas berhasil diperbarui.",
      data: formatTask(updatedTask),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a task.
 * DELETE /api/tasks/:id
 */
export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const taskId = parseInt(req.params.id as string, 10);

    if (isNaN(taskId)) {
      res.status(400).json({
        success: false,
        message: "ID tugas tidak valid.",
      });
      return;
    }

    await taskService.deleteTask(userId, taskId);

    res.status(200).json({
      success: true,
      message: "Tugas berhasil dihapus.",
    });
  } catch (error) {
    next(error);
  }
};
