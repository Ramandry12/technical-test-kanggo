import { TaskStatus, Prisma } from "@prisma/client";
import prisma from "../config/database";
import { CreateTaskInput, UpdateTaskInput } from "../validators/taskValidator";
import { NotFoundError } from "../errors/apiError";

const mapStatusToPrisma = (status: string): TaskStatus => {
  if (status === "in-progress") return TaskStatus.in_progress;
  return status as TaskStatus;
};

export const getAllTasks = async (
  userId: number,
  filters: {
    status?: string;
    search?: string;
    page?: any;
    limit?: any;
  },
) => {
  const { status, search, page, limit } = filters;

  const where: Prisma.TaskWhereInput = {
    userId,
  };

  if (status) {
    where.status = mapStatusToPrisma(status);
  }

  if (search) {
    where.title = {
      contains: search,
    };
  }

  const pageNum = typeof page === "number" ? page : parseInt(page || "1", 10);
  const limitNum =
    typeof limit === "number" ? limit : parseInt(limit || "10", 10);

  const totalItems = await prisma.task.count({ where });
  const skip = (pageNum - 1) * limitNum;

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: limitNum,
  });

  const totalPages = Math.ceil(totalItems / limitNum);

  return {
    tasks,
    meta: {
      totalItems,
      itemCount: tasks.length,
      itemsPerPage: limitNum,
      totalPages,
      currentPage: pageNum,
    },
  };
};

export const createTask = async (userId: number, input: CreateTaskInput) => {
  const { title, description, status, deadline } = input;

  return await prisma.task.create({
    data: {
      title,
      description: description || null,
      status: status ? mapStatusToPrisma(status) : TaskStatus.pending,
      deadline: deadline ? new Date(deadline) : null,
      userId,
    },
  });
};

export const updateTask = async (
  userId: number,
  taskId: number,
  input: UpdateTaskInput,
) => {
  const existingTask = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!existingTask) {
    throw new NotFoundError("Tugas tidak ditemukan.");
  }

  const { title, description, status, deadline } = input;

  const updateData: Prisma.TaskUpdateInput = {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description: description || null }),
    ...(status !== undefined && { status: mapStatusToPrisma(status) }),
    ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
  };

  return await prisma.task.update({
    where: { id: taskId },
    data: updateData,
  });
};

export const deleteTask = async (userId: number, taskId: number) => {
  const existingTask = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!existingTask) {
    throw new NotFoundError("Tugas tidak ditemukan.");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });
};
