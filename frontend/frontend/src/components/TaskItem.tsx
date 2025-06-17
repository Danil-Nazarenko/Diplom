import React from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { Task, TaskStatus } from '../types/task';

interface TaskItemProps {
  task: Task;
  addSubtask?: (taskId: string, subtask: Omit<Task, 'id' | 'status' | 'subtasks'>) => void;
  onTaskUpdate?: (id: string, updatedFields: Partial<Task>) => void;
}

const statusLabels: Record<TaskStatus, string> = {
  not_started: 'Не готово',
  in_progress: 'В процессе',
  done: 'Готово',
};

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const priorityColors = {
    high: '#d32f2f',
    medium: '#fbc02d',
    low: '#388e3c',
  };

  const priorityText =
    task.priority === 'high'
      ? 'Высокий'
      : task.priority === 'medium'
      ? 'Средний'
      : 'Низкий';

  return (
    <Card
      sx={{
        bgcolor: '#1b6c77', // светлый фон, чем #163f47
        color: '#fff',
        mb: 1,
        width: '100%', // на всю ширину контейнера
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        borderRadius: 0, // острые углы, без скругления
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)', // сильная тень
      }}
      elevation={0} // отключаем дефолтную тень MUI
    >
      <CardContent sx={{ flexGrow: 1, overflowY: 'auto', paddingBottom: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold" noWrap>
          {task.title}
        </Typography>

        {task.description && (
          <Typography
            variant="body2"
            sx={{ mt: 1, whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}
          >
            {task.description}
          </Typography>
        )}

        {task.deadline && (
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            Дедлайн: {new Date(task.deadline).toLocaleString()}
          </Typography>
        )}

        <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {task.status && (
            <Chip
              label={statusLabels[task.status]}
              size="small"
              sx={{ bgcolor: '#288394', color: '#fff' }}
            />
          )}
          {/* Убрали дублирующий Chip приоритета */}
        </Box>

        {/* Новая строка Приоритет с цветом */}
        <Typography
          variant="body1"
          sx={{ mt: 2, fontWeight: 'bold', color: priorityColors[task.priority] }}
        >
          Приоритет: {priorityText}
        </Typography>

        {task.subtasks && task.subtasks.length > 0 && (
          <Box
            sx={{
              mt: 2,
              pl: 2,
              borderLeft: '2px solid #288394',
              maxHeight: 70,
              overflowY: 'auto',
            }}
          >
            {task.subtasks.map(subtask => (
              <Typography
                key={subtask.id}
                variant="body2"
                sx={{
                  mb: 0.5,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
                title={subtask.title}
              >
                — {subtask.title}
              </Typography>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
  