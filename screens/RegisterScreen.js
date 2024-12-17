import React, { useState, useLayoutEffect } from 'react'
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Button, Image, Input, Text } from 'react-native-elements'
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  const signUp = () => {
    if (!name || !email || !password) {
      alert('All fields are mandatory')
      return
    }
    setSubmitLoading(true)
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, email, password)
      .then(authUser => {
        clearInput()
        updateProfile(authUser.user, { displayName: name })
          .then(() => {})
          .catch(error => alert(error.message))
      })
      .catch(error => alert(error.message))
      .finally(() => setSubmitLoading(false))
  }

  const clearInput = () => {
    setName('')
    setEmail('')
    setPassword('')
    setSubmitLoading(false)
    alert('Successfully created account')
    navigation.navigate('Home')
  }

  return (
    <KeyboardAvoidingView behavior='padding' style={styles.container}>
      <StatusBar style='light' />
      <Image
        source={{
          uri: 'https://u7.uidownload.com/vector/666/533/vector-icon-sticker-realistic-design-on-paper-purse-vector-eps-ai.jpg',
        }}
        style={{
          width: 100,
          height: 100,
          marginBottom: 50,
        }}
      />
      <Text h4 style={{ marginBottom: 50 }}>
        Create Account
      </Text>
      <View style={styles.inputContainer}>
        <Input
          type='text'
          placeholder='Name'
          autofocus
          value={name}
          onChangeText={name => setName(name)}
        />
        <Input
          type='email'
          placeholder='Email'
          value={email}
          onChangeText={email => setEmail(email)}
        />
        <Input
          type='password'
          placeholder='Password'
          secureTextEntry
          value={password}
          onChangeText={password => setPassword(password)}
        />
      </View>
      <Button
        title='Register'
        containerStyle={styles.button}
        onPress={signUp}
        loading={submitLoading}
      />
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 300,
    marginTop: 10,
  },
})
