import { useMatch } from '@tanstack/react-router';
import { tasksRoute } from '../router/routes';

const TasksPage = () => {
  const match = useMatch({ from: tasksRoute.id }); // <-- ключевая строка

  const { topicId } = match.params;

  return <div>Задачи для темы {topicId}</div>;
};

export default TasksPage;
