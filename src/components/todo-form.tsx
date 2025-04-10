import React, {useState, useCallback} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {TextInput, Button, HelperText} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useDispatch} from 'react-redux';
import {addTodo, updateTodo} from '../store/todo-slice';

interface TodoFormProps {
  initialTodo?: {
    id: string;
    name: string;
    description: string;
    dueDate: string;
    dueTime: string;
  };
  onSubmit?: () => void;
}

const TodoForm = ({initialTodo, onSubmit}: TodoFormProps) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(initialTodo?.name || '');
  const [description, setDescription] = useState(
    initialTodo?.description || '',
  );
  const [date, setDate] = useState(
    initialTodo ? new Date(initialTodo.dueDate) : new Date(),
  );
  const [time, setTime] = useState(
    initialTodo ? new Date(`2000-01-01T${initialTodo.dueTime}`) : new Date(),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  const resetForm = useCallback(() => {
    setName('');
    setDescription('');
    setDate(new Date());
    setTime(new Date());
    setNameError(false);
    setDescriptionError(false);
    setShowDatePicker(false);
    setShowTimePicker(false);
  }, []);

  const validateInputs = useCallback(() => {
    const isNameValid = name.trim().length > 0;
    const isDescriptionValid = description.trim().length > 0;

    setNameError(!isNameValid);
    setDescriptionError(!isDescriptionValid);

    return isNameValid && isDescriptionValid;
  }, [name, description]);

  const handleSubmit = useCallback(() => {
    if (!validateInputs()) {
      return;
    }

    const todoData = {
      id: initialTodo?.id || Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      dueDate: date.toISOString().split('T')[0],
      dueTime: time.toTimeString().split(' ')[0],
      completed: false,
    };

    if (initialTodo) {
      dispatch(updateTodo(todoData));
    } else {
      dispatch(addTodo(todoData));
      resetForm();
    }

    onSubmit?.();
  }, [
    name,
    description,
    date,
    time,
    initialTodo,
    dispatch,
    onSubmit,
    validateInputs,
    resetForm,
  ]);

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Name"
        value={name}
        onChangeText={text => {
          setName(text);
          if (nameError) setNameError(false);
        }}
        style={styles.input}
        mode="outlined"
        outlineColor={nameError ? '#FF0000' : '#2196F3'}
        activeOutlineColor="#2196F3"
        error={nameError}
      />
      {nameError && (
        <HelperText type="error" style={styles.errorText}>
          Name cannot be empty
        </HelperText>
      )}

      <TextInput
        label="Description"
        value={description}
        onChangeText={text => {
          setDescription(text);
          if (descriptionError) setDescriptionError(false);
        }}
        multiline
        style={styles.input}
        mode="outlined"
        outlineColor={descriptionError ? '#FF0000' : '#2196F3'}
        activeOutlineColor="#2196F3"
        error={descriptionError}
      />
      {descriptionError && (
        <HelperText type="error" style={styles.errorText}>
          Description cannot be empty
        </HelperText>
      )}

      <View style={styles.dateTimeContainer}>
        <View style={styles.dateTimeField}>
          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(!showDatePicker)}
            style={styles.dateTimeButton}>
            {date.toLocaleDateString()}
          </Button>
          {showDatePicker && (
            <DateTimePicker
              testID="datePicker"
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              style={Platform.OS === 'ios' ? styles.iosDatePicker : undefined}
            />
          )}
        </View>

        <View style={styles.dateTimeField}>
          <Button
            mode="outlined"
            onPress={() => setShowTimePicker(!showTimePicker)}
            style={styles.dateTimeButton}>
            {time.toLocaleTimeString()}
          </Button>
          {showTimePicker && (
            <DateTimePicker
              testID="timePicker"
              value={time}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onTimeChange}
              style={Platform.OS === 'ios' ? styles.iosDatePicker : undefined}
            />
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}>
          {initialTodo ? 'Update Todo' : 'Add Todo'}
        </Button>
        {!initialTodo && (
          <Button
            mode="outlined"
            onPress={resetForm}
            style={styles.resetButton}>
            Reset Form
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  input: {
    marginBottom: 4,
    backgroundColor: '#FFFFFF',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  dateTimeField: {
    flex: 1,
    marginHorizontal: 4,
  },
  dateTimeButton: {
    borderColor: '#2196F3',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  submitButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 6,
  },
  resetButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 6,
  },
  errorText: {
    marginBottom: 12,
    color: '#FF0000',
  },
  iosDatePicker: {
    width: '100%',
    height: 200,
    marginTop: 8,
  },
});

export default React.memo(TodoForm);
