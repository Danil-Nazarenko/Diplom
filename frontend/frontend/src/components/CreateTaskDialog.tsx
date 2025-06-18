import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem,
} from '@mui/material';
import { TaskStatus, TaskPriority, TaskPriorityType } from '../constants/taskConstants';
import { createTask } from '../api/tasksApi';
import { Task } from '../types/task';

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  topicId: number;
  onCreate: (task: Omit<Task, 'id' | 'topicId'>) => void; 
}

export const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  open,
  onClose,
  topicId,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<TaskPriorityType>(TaskPriority.MEDIUM);

  const handleCreate = async () => {
    if (!title.trim()) return;

    // Преобразуем дату в ISO-строку или undefined
    const taskData = {
      title,
      description,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      priority,
      status: TaskStatus.NOT_STARTED,
      topicId,
    };

    console.log(taskData);

    try {
      await createTask(taskData);

      setTitle('');
      setDescription('');
      setDeadline('');
      setPriority(TaskPriority.MEDIUM);

      onClose();

      // передаём задачу без topicId и id (как ожидается по типу)
      const { topicId, ...taskWithoutTopicId } = taskData;
      onCreate(taskWithoutTopicId);
    } catch (error) {
      console.error('Ошибка при создании подзадачи:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: '#1e545e',
          color: '#fff',
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ fontFamily: 'Romaben', fontSize: '22px', color: '#e0f7fa' }}>
        Создать подзадачу
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Название"
          fullWidth
          required
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          sx={{
            input: { color: '#fff' },
            label: { color: '#ccc' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#288394' },
              '&:hover fieldset': { borderColor: '#48a3b0' },
              '&.Mui-focused fieldset': { borderColor: '#fff' },
            },
          }}
        />

        <TextField
          label="Описание"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{
            textarea: { color: '#fff' },
            label: { color: '#ccc' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#288394' },
              '&:hover fieldset': { borderColor: '#48a3b0' },
              '&.Mui-focused fieldset': { borderColor: '#fff' },
            },
          }}
        />

        <TextField
          label="Дедлайн"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          sx={{
            input: { color: '#fff' },
            label: { color: '#ccc' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#288394' },
              '&:hover fieldset': { borderColor: '#48a3b0' },
              '&.Mui-focused fieldset': { borderColor: '#fff' },
            },
          }}
        />

        <TextField
          select
          label="Приоритет"
          fullWidth
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriorityType)}
          sx={{
            label: { color: '#ccc' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#288394' },
              '&:hover fieldset': { borderColor: '#48a3b0' },
              '&.Mui-focused fieldset': { borderColor: '#fff' },
            },
            '& .MuiSelect-select': {
              color:
                priority === TaskPriority.HIGH
                  ? '#e57373'
                  : priority === TaskPriority.MEDIUM
                  ? '#fff176'
                  : '#81c784',
              fontWeight: 600,
            },
          }}
        >
          <MenuItem value={TaskPriority.LOW} sx={{ color: '#81c784', fontWeight: 600 }}>
            Низкий
          </MenuItem>
          <MenuItem value={TaskPriority.MEDIUM} sx={{ color: '#fff176', fontWeight: 600 }}>
            Средний
          </MenuItem>
          <MenuItem value={TaskPriority.HIGH} sx={{ color: '#e57373', fontWeight: 600 }}>
            Высокий
          </MenuItem>
        </TextField>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#ccc',
            fontFamily: 'Poppins',
            '&:hover': { color: '#fff' },
          }}
        >
          Отмена
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          sx={{
            backgroundColor: '#14353b',
            color: '#288394',
            fontFamily: 'Poppins',
            '&:hover': {
              backgroundColor: '#288394',
              color: '#fff',
            },
          }}
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};
