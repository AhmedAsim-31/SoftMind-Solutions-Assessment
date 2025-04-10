import React from 'react';
import {View, StyleSheet} from 'react-native';
import TodoForm from '../components/todo-form';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <TodoForm />
      <Button
        mode="contained"
        onPress={() => navigation.navigate('TodoList')}
        style={styles.viewListButton}>
        View Todo List
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  viewListButton: {
    margin: 16,
    paddingVertical: 6,
  },
});

export default HomeScreen;
