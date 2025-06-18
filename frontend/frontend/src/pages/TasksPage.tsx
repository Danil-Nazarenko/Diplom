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

const menuItems = [
  { label: 'Задачи', icon: <HomeIcon /> },
  { label: 'Календарь', icon: <AssignmentIcon /> },
  { label: 'Профиль', icon: <PersonIcon /> },
];

export default function TasksPage() {
  const { topicId } = useParams({ from: '/tasks/$topicId' });
  const numericTopicId = topicId ? Number(topicId) : undefined;

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

  useEffect(() => {
    if (numericTopicId === undefined) return;

    (async () => {
      try {
        const serverTasks: Task[] = await getTasksByTopicId(numericTopicId);
        setTasks(serverTasks);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('Ошибка загрузки задач:', message);
      }
    })();
  }, [numericTopicId, setTasks]);

  const filteredTasks =
    numericTopicId !== undefined
      ? tasks.filter((task) => task.topicId === numericTopicId)
      : tasks;

  const selectedTaskTitle =
    numericTopicId !== undefined
      ? `Тема №${numericTopicId}`
      : tasks.length > 0
      ? tasks[0].title
      : 'Все задачи';

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
        <AppBar position="static" sx={{ bgcolor: '#14353b', height: 64, justifyContent: 'center' }}>
          <Toolbar>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: '#e0f7fa',
                fontFamily: 'Romaben',
                ml: 2,
              }}
            >
              {selectedTaskTitle}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
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
            tasks={filteredTasks}
            onStatusChange={moveTaskToStatus}
            onTaskUpdate={updateTask}
            addSubtask={addSubtask}
          />

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
