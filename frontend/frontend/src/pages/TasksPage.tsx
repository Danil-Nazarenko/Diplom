import React, { useState, useEffect } from 'react';
import { useParams } from '@tanstack/react-router';
import {
  Box,
  Button,
  Typography,
  Drawer,
  List,
  Tooltip,
  AppBar,
  Toolbar,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import { TaskBoard } from '../components/TaskBoard';
import { CreateTaskDialog } from '../components/CreateTaskDialog';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types/task';
import { getTasksByTopicId, createTask } from '../api/tasksApi';
import { getTopicById } from '../api/topicsApi';

const menuItems = [
  { label: 'Задачи', icon: <HomeIcon /> },
  { label: 'Календарь', icon: <AssignmentIcon /> },
  { label: 'Профиль', icon: <PersonIcon /> },
];

export default function TasksPage() {
  const { topicId } = useParams({ from: '/tasks/$topicId' });
  const numericTopicId = topicId ? Number(topicId) : undefined;

  const [topicName, setTopicName] = useState<string | null>(null);
  const [topicDeadline, setTopicDeadline] = useState<string | null>(null);

  if (topicId !== undefined && isNaN(numericTopicId!)) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: '#1e545e',
          color: '#fff',
          fontFamily: 'Romaben',
          fontSize: 20,
        }}
      >
        Некорректный ID темы
      </Box>
    );
  }

  const { tasks, updateTask, moveTaskToStatus, addSubtask, setTasks } = useTasks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Новый стейт для индикации загрузки ИИ
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (numericTopicId === undefined) return;

    (async () => {
      try {
        const serverTasks: Task[] = await getTasksByTopicId(numericTopicId);
        setTasks(serverTasks);

        const topic = await getTopicById(numericTopicId);
        setTopicName(topic.title);
        setTopicDeadline(
          topic.deadline ? new Date(topic.deadline).toLocaleDateString() : null
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('Ошибка при загрузке задач или темы:', message);
      }
    })();
  }, [numericTopicId, setTasks]);

  const handleCreateTask = async (task: Omit<Task, 'id' | 'topicId'>) => {
    if (numericTopicId === undefined || isCreating) return;

    setIsCreating(true);
    try {
      await createTask({ ...task, topicId: numericTopicId });
      const serverTasks: Task[] = await getTasksByTopicId(numericTopicId);
      setTasks(serverTasks);
      setIsDialogOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Ошибка создания задачи:', message);
    } finally {
      setIsCreating(false);
    }
  };

  // Обработчик для кнопки ИИ-ассистента
  const handleUseAiAssistant = async () => {
    if (!numericTopicId || isAiLoading) return;

    setIsAiLoading(true);
    try {
      const response = await fetch(`/api/ai/generate-tasks?topicId=${numericTopicId}`, {
        headers: {
          // Добавь сюда токен авторизации, если нужен:
          // Authorization: `Bearer ${yourAuthToken}`,
        },
      });
      if (!response.ok) throw new Error('Ошибка при вызове ИИ');

      const data = await response.json();
      // Ожидаем, что data.tasks — массив подзадач в формате Task[]
      if (Array.isArray(data.tasks)) {
        setTasks((prev) => [...prev, ...data.tasks]);
      } else {
        console.warn('Неправильный формат данных от ИИ');
      }
    } catch (error) {
      console.error('Ошибка при получении подзадач от ИИ:', error);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#1e545e', color: '#fff', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 70,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 70,
            boxSizing: 'border-box',
            bgcolor: '#14353b',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 2,
          },
        }}
      >
        <Typography variant="h6" sx={{ fontFamily: 'Romaben', mb: 3 }}>
          LO
        </Typography>

        <List sx={{ width: '100%' }}>
          {menuItems.map((item, index) => (
            <Tooltip key={index} title={item.label} placement="right">
              <Box
                component="div"
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  my: 2,
                  cursor: 'pointer',
                  fontSize: 30,
                  color: '#fff',
                  '&:hover': { color: '#a7ffeb' },
                }}
              >
                {item.icon}
              </Box>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      <Box sx={{ width: 'calc(100% - 70px)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" sx={{ bgcolor: '#14353b', height: 64 }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: '#e0f7fa',
                fontFamily: 'Romaben',
                whiteSpace: 'nowrap',
              }}
            >
              {topicName ?? 'Загрузка темы...'}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#a7ffeb',
                fontFamily: 'Romaben',
                fontSize: 14,
                whiteSpace: 'nowrap',
              }}
            >
              {topicDeadline ? `Дедлайн: ${topicDeadline}` : 'Дедлайн не установлен'}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Button
              variant="contained"
              onClick={() => setIsDialogOpen(true)}
              sx={{
                backgroundColor: '#14353b',
                color: '#288394',
                fontFamily: '"Poppins", XI20',
                mt: 2,
              }}
            >
              Создать подзадачу
            </Button>
          </Box>

          <TaskBoard
            tasks={tasks}
            onStatusChange={moveTaskToStatus}
            onTaskUpdate={updateTask}
            addSubtask={addSubtask}
          />

          {/* Кнопка ИИ-ассистента */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              variant="contained"
              onClick={handleUseAiAssistant}
              disabled={isAiLoading}
              sx={{
                backgroundColor: '#14353b',
                color: '#288394',
                fontFamily: '"Poppins", XI20',
                mt: 2,
              }}
            >
              {isAiLoading ? 'Генерация...' : 'Использовать ИИ-ассистента'}
            </Button>
          </Box>

          {numericTopicId !== undefined && (
            <CreateTaskDialog
              open={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              onCreate={handleCreateTask}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
