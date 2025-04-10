import axios from 'axios';
import { Todo } from '../store/todo-slice';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

export interface ApiTodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const response = await axios.get<ApiTodo[]>(API_URL);
    return response.data.map(todo => ({
      id: todo.id.toString(),
      name: todo.title,
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '00:00',
      completed: todo.completed,
    }));
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
}; 