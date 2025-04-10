import React, {useMemo, useCallback, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  Searchbar,
  Button,
  Menu,
  Modal,
  ActivityIndicator,
} from 'react-native-paper';
import {RootState} from '../store/store';
import TodoItem from '../components/todo-item';
import TodoForm from '../components/todo-form';
import {Todo, mergeTodos, setLoading, setError} from '../store/todo-slice';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {fetchTodos} from '../services/todo-api';

type TodoListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TodoList'
>;

type SortOption = 'name' | 'date' | 'time';
type SortOrder = 'asc' | 'desc';

const TodoListScreen = () => {
  const navigation = useNavigation<TodoListScreenNavigationProp>();
  const dispatch = useDispatch();
  const {todos, isLoading, error} = useSelector(
    (state: RootState) => state.todos,
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const sortedAndFilteredTodos = useMemo(() => {
    const searchQueryLower = searchQuery.toLowerCase();
    let filteredTodos = todos.filter(
      todo =>
        todo.name.toLowerCase().includes(searchQueryLower) ||
        todo.description.toLowerCase().includes(searchQueryLower) ||
        todo.dueDate.toLowerCase().includes(searchQueryLower) ||
        todo.dueTime.toLowerCase().includes(searchQueryLower),
    );

    return filteredTodos.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison =
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'time':
          comparison = a.dueTime.localeCompare(b.dueTime);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [todos, searchQuery, sortBy, sortOrder]);

  const handleEdit = useCallback((todo: Todo) => {
    setEditingTodo(todo);
  }, []);

  const handleEditComplete = useCallback(() => {
    setEditingTodo(null);
  }, []);

  const renderItem = useCallback(
    ({item}: {item: Todo}) => {
      return <TodoItem todo={item} onEdit={handleEdit} />;
    },
    [handleEdit],
  );

  /**
   * Extracts a unique key for each todo item
   * @param {Todo} item - The todo item
   * @returns {string} The unique key (todo id)
   */
  const keyExtractor = useCallback((item: Todo) => item.id, []);

  /**
   * Handles the sorting of todos
   * @param {SortOption} newSortBy - The new sort option
   */
  const handleSort = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      // Toggle sort order if same sort option is selected
      setSortOrder(current => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
    setShowSortMenu(false);
  };

  /**
   * Fetches todos from the API and updates the store
   */
  const handleFetchTodos = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const fetchedTodos = await fetchTodos();
      dispatch(mergeTodos(fetchedTodos));
    } catch (err) {
      dispatch(
        setError(err instanceof Error ? err.message : 'Failed to fetch todos'),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search todos..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <Menu
          visible={showSortMenu}
          onDismiss={() => setShowSortMenu(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setShowSortMenu(true)}
              style={styles.sortButton}>
              Sort By
            </Button>
          }>
          <Menu.Item
            onPress={() => handleSort('name')}
            title={`Name ${
              sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''
            }`}
          />
          <Menu.Item
            onPress={() => handleSort('date')}
            title={`Date ${
              sortBy === 'date' ? (sortOrder === 'asc' ? '↑' : '↓') : ''
            }`}
          />
          <Menu.Item
            onPress={() => handleSort('time')}
            title={`Time ${
              sortBy === 'time' ? (sortOrder === 'asc' ? '↑' : '↓') : ''
            }`}
          />
        </Menu>
      </View>

      <View style={styles.statsContainer}>
        <Button mode="text">Total: {sortedAndFilteredTodos.length}</Button>
        <Button mode="text">
          Completed:
          {sortedAndFilteredTodos.filter(todo => todo.completed).length}
        </Button>
        <Button mode="text">
          Pending:
          {sortedAndFilteredTodos.filter(todo => !todo.completed).length}
        </Button>
      </View>
      <Button
        mode="contained"
        onPress={handleFetchTodos}
        loading={isLoading}
        disabled={isLoading}
        style={styles.fetchButton}>
        Fetch Todos
      </Button>

      {error && (
        <View style={styles.errorContainer}>
          <Button mode="text" textColor="red">
            {error}
          </Button>
        </View>
      )}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={sortedAndFilteredTodos}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Button mode="text">
                {searchQuery ? 'No matching todos found' : 'No todos yet'}
              </Button>
            </View>
          }
        />
      )}

      <Modal
        visible={editingTodo !== null}
        onDismiss={() => setEditingTodo(null)}
        style={styles.modalContainer}>
        <TodoForm
          initialTodo={editingTodo || undefined}
          onSubmit={handleEditComplete}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  sortButton: {
    borderColor: '#2196F3',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 32,
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    borderRadius: 28,
    paddingHorizontal: 16,
  },
  modalContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  fetchButton: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
});

export default TodoListScreen;
