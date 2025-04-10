import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home-screen';
import TodoListScreen from '../screens/todo-list-screen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          title: 'Add Todo'
        }}
      />
      <Stack.Screen 
        name="TodoList" 
        component={TodoListScreen}
        options={{
          title: 'Todo List'
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator; 