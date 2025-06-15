import { useParams } from '@tanstack/react-router';
import {
  Box, Typography, Button, Card, CardContent, Chip, Drawer,
  List, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel
} from '@mui/material';
import { useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ru } from 'date-fns/locale';


interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'not_started' | 'in_progress' | 'done';
}

const menuItems = [
  { label: 'Задачи', icon: <HomeIcon /> },
  { label: 'Календарь', icon: <AssignmentIcon /> },
  { label: 'Профиль', icon: <PersonIcon /> },
];

const priorityColors: Record<Task['priority'], string> = {
  high: '#d32f2f',
  medium: '#fbc02d',
  low: '#388e3c',
};

const TasksPage = () => {
  const { topicId } = useParams({ strict: false }) as { topicId: string };
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState<Date | null>(null);
  const [taskPriority, setTaskPriority] = useState<Task['priority']>('medium');

  const handleCreateTask = () => {
    if (!taskTitle.trim()) return;

    const newId = tasks.length + 1;
    setTasks([
      ...tasks,
      {
        id: newId,
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        deadline: taskDeadline ? taskDeadline.toISOString() : '',
        priority: taskPriority,
        status: 'not_started',
      },
    ]);
    setTaskTitle('');
    setTaskDescription('');
    setTaskDeadline(null);
    setTaskPriority('medium');
    setDialogOpen(false);
  };

  const renderTasksByStatus = (
    status: Task['status'],
    label: string,
    color: string,
    addRightBorder: boolean
  ) => (
    <Box
      sx={{
        flex: 1,
        px: 2,
        minWidth: 0,
        maxWidth: '33%',
        borderRight: addRightBorder ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: '#fff',
          mb: 2,
          textAlign: 'center',
          fontFamily: 'Poppins',
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {tasks
          .filter((task) => task.status === status)
          .map((task) => (
            <Card key={task.id} sx={{ bgcolor: '#1e545e', color: '#fff', maxWidth: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {task.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                  }}
                >
                  {task.description}
                </Typography>
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  Дедлайн: {task.deadline ? new Date(task.deadline).toLocaleString() : 'не указан'}
                </Typography>
                <Chip label={label} sx={{ mt: 1, bgcolor: color, color: '#fff' }} />
                <Chip
                  label={
                    task.priority === 'high'
                      ? 'Высокий'
                      : task.priority === 'medium'
                      ? 'Средний'
                      : 'Низкий'
                  }
                  sx={{
                    mt: 1,
                    ml: 1,
                    bgcolor: priorityColors[task.priority],
                    color: '#fff',
                  }}
                />
              </CardContent>
            </Card>
          ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#1e545e' }}>
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
            alignItems: 'center',
          },
        }}
      >
        <Typography variant="h6" sx={{ mt: 1, fontFamily: 'Romaben' }}>
          LO
        </Typography>
        <List sx={{ mt: 2 }}>
          {menuItems.map((item, index) => (
            <Tooltip title={item.label} placement="right" key={index}>
              <Box component="div" sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                {item.icon}
              </Box>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4, minHeight: '100%' }}>
        <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
          Задачи для темы #{topicId}
        </Typography>

        <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => setDialogOpen(true)}
            sx={{ bgcolor: '#288394', color: '#fff' }}
          >
            Добавить подзадачу
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 0 }}>
          {renderTasksByStatus('not_started', 'Не готово', '#aa4c4c', true)}
          {renderTasksByStatus('in_progress', 'В процессе', '#d6a138', true)}
          {renderTasksByStatus('done', 'Готово', '#3a915f', false)}
        </Box>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              bgcolor: '#1e545e',
              color: '#fff',
              borderRadius: 3,
              p: 2,
              fontFamily: 'Poppins',
            },
          }}
        >
          <DialogTitle sx={{ fontSize: 22, fontWeight: 'bold', color: '#fff' }}>
            Создать подзадачу
          </DialogTitle>

          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              label="Название задачи"
              fullWidth
              variant="outlined"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              InputProps={{
                sx: {
                  color: '#fff',
                  bgcolor: '#14353b',
                  borderRadius: 2,
                },
              }}
              InputLabelProps={{
                sx: {
                  color: '#ccc',
                  '&.Mui-focused': { color: '#288394' },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#288394' },
                  '&:hover fieldset': { borderColor: '#40a2b1' },
                  '&.Mui-focused fieldset': { borderColor: '#288394' },
                },
              }}
            />

            <TextField
              label="Краткое описание"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              InputProps={{
                sx: {
                  color: '#fff',
                  bgcolor: '#14353b',
                  borderRadius: 2,
                },
              }}
              InputLabelProps={{
                sx: {
                  color: '#ccc',
                  '&.Mui-focused': { color: '#288394' },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#288394' },
                  '&:hover fieldset': { borderColor: '#40a2b1' },
                  '&.Mui-focused fieldset': { borderColor: '#288394' },
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel
                sx={{
                  color: '#ccc',
                  '&.Mui-focused': { color: '#288394' },
                }}
              >
                Приоритет
              </InputLabel>
              <Select
                value={taskPriority}
                label="Приоритет"
                onChange={(e: SelectChangeEvent<Task['priority']>) =>
                  setTaskPriority(e.target.value as Task['priority'])
                }
                sx={{
                  color: '#fff',
                  bgcolor: '#14353b',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#288394',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#40a2b1',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#288394',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: '#1e545e',
                      color: '#fff',
                    },
                  },
                }}
              >
                <MenuItem value="high" sx={{ color: '#d32f2f' }}>Высокий</MenuItem>
                <MenuItem value="medium" sx={{ color: '#fbc02d' }}>Средний</MenuItem>
                <MenuItem value="low" sx={{ color: '#388e3c' }}>Низкий</MenuItem>
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
              <DateTimePicker
                label="Срок сдачи"
                value={taskDeadline}
                onChange={(newValue: Date | null) => setTaskDeadline(newValue)}
                minDateTime={new Date()} // запрещаем выбор даты и времени в прошлом
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!taskDeadline && taskDeadline < new Date(),
                    helperText: taskDeadline && taskDeadline < new Date() ? 'Дата не может быть в прошлом' : '',
                    sx: {
                      color: '#fff',
                      bgcolor: '#14353b',
                      input: { color: '#fff' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#288394' },
                        '&:hover fieldset': { borderColor: '#40a2b1' },
                        '&.Mui-focused fieldset': { borderColor: '#288394' },
                      },
                    },
                    InputLabelProps: {
                      sx: {
                        color: '#ccc',
                        '&.Mui-focused': { color: '#288394' },
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => setDialogOpen(false)}
              sx={{ color: '#fff', '&:hover': { bgcolor: '#14353b' } }}
            >
              Отмена
            </Button>
            <Button
              onClick={handleCreateTask}
              variant="contained"
              sx={{ bgcolor: '#288394' }}
            >
              Добавить
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default TasksPage;
