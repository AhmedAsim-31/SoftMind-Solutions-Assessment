import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {Card, Title, Paragraph, Button} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {deleteTodo, toggleTodo} from '../store/todo-slice';
import {Todo} from '../store/todo-slice';

interface TodoItemProps {
  todo: Todo;
  onEdit?: (todo: Todo) => void;
}

const TodoItem = ({todo, onEdit}: TodoItemProps) => {
  const dispatch = useDispatch();

  const handleDelete = useCallback(() => {
    dispatch(deleteTodo(todo.id));
  }, [dispatch, todo.id]);

  const handleToggle = useCallback(() => {
    dispatch(toggleTodo(todo.id));
  }, [dispatch, todo.id]);

  const handleEdit = useCallback(() => {
    if (!todo.completed) {
      onEdit?.(todo);
    }
  }, [onEdit, todo]);

  return (
    <Card style={[styles.card, todo.completed && styles.completedCard]}>
      <Card.Content>
        <Title style={styles.title}>{todo.name}</Title>
        <Paragraph style={styles.description}>{todo.description}</Paragraph>
        <Paragraph style={styles.dateTime}>
          Due: {todo.dueDate} at {todo.dueTime}
        </Paragraph>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button
          onPress={handleToggle}
          mode="outlined"
          style={styles.actionButton}>
          {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </Button>
        <Button
          onPress={handleEdit}
          mode="outlined"
          style={[styles.actionButton, todo.completed && styles.disabledButton]}
          disabled={todo.completed}>
          Edit
        </Button>
        <Button
          onPress={handleDelete}
          mode="outlined"
          style={styles.actionButton}>
          Delete
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    borderRadius: 8,
    borderColor: '#E3F2FD',
    borderWidth: 1,
  },
  completedCard: {
    opacity: 0.7,
    backgroundColor: '#F5F5F5',
  },
  title: {
    color: '#2196F3',
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    color: '#424242',
    marginVertical: 8,
  },
  dateTime: {
    color: '#757575',
    fontSize: 12,
  },
  actions: {
    justifyContent: 'flex-end',
    padding: 8,
  },
  actionButton: {
    marginHorizontal: 4,
    borderColor: '#2196F3',
  },
  disabledButton: {
    opacity: 0.5,
    borderColor: '#BDBDBD',
  },
});

export default React.memo(TodoItem);
