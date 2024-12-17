import React, { useState, useLayoutEffect } from 'react'
import { View, StyleSheet, KeyboardAvoidingView, TextInput } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Text, Button } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker'
import { format } from 'date-fns'
import { db, auth } from '../firebase'
import { Picker } from '@react-native-picker/picker'
import { addDoc, collection } from 'firebase/firestore'
import { serverTimestamp } from 'firebase/firestore'

const AddScreen = ({ navigation }) => {
  const [date, setDate] = useState(new Date())
  const [show, setShow] = useState(false)
  const [mode, setMode] = useState('date')
  const [input, setInput] = useState('')
  const [amount, setAmount] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [selected, setSelected] = useState('expense')

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Add Expense',
    })
  }, [navigation])

  const createExpense = () => {
    if (!input || !amount || !date || !selected || !auth) {
      alert('All fields are mandatory')
      return
    }
    setSubmitLoading(true)
    addDoc(collection(db, 'expense'), {
      email: auth.currentUser.email,
      text: input,
      price: amount,
      type: selected,
      timestamp: serverTimestamp(),
      date: result,
    })
      .then(docRef => {
        console.log(`Document written with id ${docRef.id}`)
        clearInput()
      })
      .catch(error => console.error('Error adding document: ', error))
      .finally(() => setSubmitLoading(false))
  }

  const clearInput = () => {
    alert('Successfully added expense')
    setInput('')
    setAmount('')
    setDate(new Date())
    setSelected('expense')
    navigation.navigate('Home')
    setSubmitLoading(false)
  }

  const showMode = currentMode => {
    setShow(true)
    setMode(currentMode)
  }

  const showDatepicker = () => {
    showMode('date')
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShow(false)
    setDate(currentDate)
  }

  const result = format(date, 'dd/MM/yyyy')

  return (
    <KeyboardAvoidingView behavior='padding' style={styles.container}>
      <StatusBar style='dark' />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Title'
          value={input}
          onChangeText={text => setInput(text)}
        />
        <TextInput
          keyboardType='numeric'
          style={styles.input}
          placeholder='Amount'
          value={amount}
          onChangeText={text => setAmount(text)}
        />
        <Text
          style={styles.input}
          value={result}
          onPress={showDatepicker}
          placeholder='Select Date'
        >
          {result ? result : new Date()}
        </Text>
        {show && (
          <DateTimePicker
            value={date}
            mode={mode}
            is24Hour={true}
            display='default'
            onChange={onChange}
          />
        )}
        <Picker
          selectedValue={selected}
          onValueChange={itemValue => setSelected(itemValue)}
          style={styles.input}
        >
          <Picker.Item label='Expense' value='expense' />
          <Picker.Item label='Income' value='income' />
        </Picker>
        <Button
          containerStyle={styles.button}
          title='Add'
          onPress={createExpense}
          loading={submitLoading}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

export default AddScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  inputContainer: {
    width: 300,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  button: {
    width: 300,
    marginTop: 10,
  },
})
