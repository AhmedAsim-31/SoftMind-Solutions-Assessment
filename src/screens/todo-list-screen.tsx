import React, {useMemo, useCallback, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {Searchbar, Button, Portal, Menu, Modal} from 'react-native-paper';
import {RootState} from '../store/store';
import TodoItem from '../components/todo-item';
import TodoForm from '../components/todo-form';
import {Todo} from '../store/todo-slice';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';

type TodoListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TodoList'
>;

type SortOption = 'name' | 'date' | 'time';
type SortOrder = 'asc' | 'desc';

const TodoListScreen = () => {
  const navigation = useNavigation<TodoListScreenNavigationProp>();
  const {todos} = useSelector((state: RootState) => state.todos);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const sortedAndFilteredTodos = useMemo(() => {
    let filteredTodos = todos.filter(
      todo =>
        todo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchQuery.toLowerCase()),
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

  const keyExtractor = useCallback((item: Todo) => item.id, []);

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
              icon="sort"
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

      <FlatList
        data={sortedAndFilteredTodos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Button mode="text" color="#757575">
              {searchQuery ? 'No matching todos found' : 'No todos yet'}
            </Button>
          </View>
        }
      />

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
});

export default TodoListScreen;
