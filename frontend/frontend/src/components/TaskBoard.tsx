import React from 'react';
import { Box, Typography } from '@mui/material';
import { Task, TaskStatus } from '../types/task';
import { TaskItem } from './TaskItem';
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const columns: { status: TaskStatus; label: string }[] = [
  { status: 'not_started', label: 'Не готово' },
  { status: 'in_progress', label: 'В процессе' },
  { status: 'done', label: 'Готово' },
];

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <Box
      ref={setNodeRef}
      sx={{
        flex: 1,
        p: 2,
        bgcolor: '#1e545e',
        borderRadius: 2,
        minHeight: '60vh',
      }}
    >
      {children}
    </Box>
  );
}

function DraggableTask({
  task,
  children,
}: {
  task: Task;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    transition: 'transform 0.2s ease',
    cursor: 'grab',
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={style}
    >
      {children}
    </Box>
  );
}

interface TaskBoardProps {
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onTaskUpdate: (id: string, updatedFields: Partial<Task>) => void;
  addSubtask: (taskId: string, subtask: Omit<Task, 'id' | 'status' | 'subtasks'>) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onStatusChange,
  onTaskUpdate,
  addSubtask,
}) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const newStatus = over.id as TaskStatus;

    const task = tasks.find(t => t.id === active.id);
    if (task && task.status !== newStatus) {
      // Обновляем локально
      onStatusChange(task.id, newStatus);

      // Здесь можно вызвать API обновления на сервере, например:
      // updateTask({ ...task, status: newStatus });
    }
  };

  const tasksByStatus = columns.reduce<Record<TaskStatus, Task[]>>((acc, col) => {
    acc[col.status] = tasks.filter(task => task.status === col.status);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {columns.map(col => (
          <DroppableColumn key={col.status} id={col.status}>
            <Typography
              variant="h6"
              sx={{ color: '#fff', textAlign: 'center', mb: 2 }}
            >
              {col.label}
            </Typography>
            <SortableContext
              id={col.status}
              items={tasksByStatus[col.status].map(task => task.id)}
              strategy={verticalListSortingStrategy}
            >
              {tasksByStatus[col.status].map(task => (
                <DraggableTask key={task.id} task={task}>
                  <TaskItem
                    task={task}
                    addSubtask={addSubtask}
                    onTaskUpdate={onTaskUpdate}
                  />
                </DraggableTask>
              ))}
            </SortableContext>
          </DroppableColumn>
        ))}
      </Box>
    </DndContext>
  );
};
