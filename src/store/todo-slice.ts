import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Todo {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  dueTime: string;
  completed: boolean;
}

interface TodoState {
  /**
   * @property {Todo[]} todos - Array of todo items
   */
  todos: Todo[];
  /**
   * @property {string} searchQuery - Current search query
   */
  searchQuery: string;
  /**
   * @property {'name' | 'date' | 'time'} sortBy - Current sort field
   */
  sortBy: 'name' | 'date' | 'time';
  /**
   * @property {'asc' | 'desc'} sortOrder - Current sort order
   */
  sortOrder: 'asc' | 'desc';
  /**
   * @property {boolean} isLoading - Loading state
   */
  isLoading: boolean;
  /**
   * @property {string | null} error - Error message if any
   */
  error: string | null;
}

/**
 * Initial state for the todo slice
 * @type {TodoState}
 */
const initialState: TodoState = {
  todos: [],
  searchQuery: '',
  sortBy: 'date',
  sortOrder: 'asc',
  isLoading: false,
  error: null,
};

/**
 * Todo slice containing all todo-related reducers and actions
 */
const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    /**
     * Adds a new todo to the list
     * @param {Todo} todo - The todo to add
     */
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    /**
     * Updates an existing todo
     * @param {Todo} todo - The updated todo
     */
    updateTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.todos.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    },
    /**
     * Deletes a todo by its ID
     * @param {string} id - The ID of the todo to delete
     */
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    /**
     * Toggles the completion status of a todo
     * @param {string} id - The ID of the todo to toggle
     */
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    /**
     * Sets the current search query
     * @param {string} query - The search query
     */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    /**
     * Sets the current sort field
     * @param {'name' | 'date' | 'time'} field - The field to sort by
     */
    setSortBy: (state, action: PayloadAction<'name' | 'date' | 'time'>) => {
      state.sortBy = action.payload;
    },
    /**
     * Sets the current sort order
     * @param {'asc' | 'desc'} order - The sort order
     */
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    /**
     * Sets the entire todos array
     * @param {Todo[]} todos - The new todos array
     */
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
    },
    /**
     * Merges new todos with existing ones, avoiding duplicates
     * @param {Todo[]} todos - The todos to merge
     */
    mergeTodos: (state, action: PayloadAction<Todo[]>) => {
      // Create a map of existing todos by ID for quick lookup
      const existingTodosMap = new Map(
        state.todos.map(todo => [todo.id, todo])
      );
      
      // Add new todos that dont already exist
      action.payload.forEach(newTodo => {
        if (!existingTodosMap.has(newTodo.id)) {
          state.todos.push(newTodo);
        }
      });
    },
    /**
     * Sets the loading state
     * @param {boolean} isLoading - The loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    /**
     * Sets the error state
     * @param {string | null} error - The error message
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  setTodos,
  mergeTodos,
  setLoading,
  setError,
} = todoSlice.actions;
export default todoSlice.reducer; 