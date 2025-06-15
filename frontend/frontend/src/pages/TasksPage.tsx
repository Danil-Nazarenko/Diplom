import { useParams } from 'react-router-dom';

const TasksPage = () => {
  const { topicId } = useParams();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Задачи темы #{topicId}</h2>
      {/* Здесь позже будут отображаться задачи */}
    </div>
  );
};

export default TasksPage;
