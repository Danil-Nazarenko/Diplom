import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Drawer,
  List,
  Tooltip,
  AppBar,
  Toolbar
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import { TaskBoard } from '../components/TaskBoard';
import { CreateTaskDialog } from '../components/CreateTaskDialog';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types/task';

const menuItems = [
  { label: 'Задачи', icon: <HomeIcon /> },
  { label: 'Календарь', icon: <AssignmentIcon /> },
  { label: 'Профиль', icon: <PersonIcon /> },
];

export default function TasksPage() {
  const { tasks, addTask, updateTask, moveTaskToStatus, addSubtask } = useTasks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const selectedTaskTitle = tasks.length > 0 ? tasks[0].title : 'Все задачи';

  const handleCreateTask = (task: Omit<Task, 'id'>) => {
    addTask(task);
    setIsDialogOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        bgcolor: '#1e545e',
        color: '#fff',
        minHeight: '100vh', // вместо height: 100vh, чтобы контент расширялся
      }}
    >
      {/* Боковое меню */}
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

      {/* Основной контент */}
      <Box
        sx={{
          width: 'calc(100% - 70px)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* Шапка */}
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

        {/* Контент с отступом от шапки */}
        <Box
          sx={{
            p: 3,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            // Добавим overflow, чтобы при большом кол-ве задач скроллилась только эта область:
            overflowY: 'auto',
          }}
        >
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
            tasks={tasks}
            onStatusChange={moveTaskToStatus}
            onTaskUpdate={updateTask}
            addSubtask={addSubtask}
          />

          <CreateTaskDialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onCreate={handleCreateTask}
          />
        </Box>
      </Box>
    </Box>
  );
}
