import React, { useState, useEffect, useLayoutEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { KeyboardAvoidingView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Button, Image, Input, Text } from 'react-native-elements'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth'
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  const signin = () => {
    if (!password || !email) {
      alert('All fields are mandatory')
      return
    }
    setSubmitLoading(true)
    const auth = getAuth()
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        clearInput()
      })
      .catch(error => alert(error.message))
      .finally(() => setSubmitLoading(false))
  }

  const clearInput = () => {
    setEmail('')
    setPassword('')
    setSubmitLoading(false)
    alert('Successfully logged in')
    navigation.replace('Home')
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), user => {
      if (user) {
        navigation.replace('Home')
        setLoading(false)
        clearInput()
      } else {
        setLoading(false)
      }
    })
    return unsubscribe
  }, [])

  useLayoutEffect(() => {
    if (!loading) {
      navigation.setOptions({
        title: 'Login',
      })
      return
    }
    navigation.setOptions({
      title: 'Loading...',
    })
  }, [navigation, loading])

  return (
    <>
      {loading ? (
        <View style={styles.container}>
          <Image
            source={{
              uri: 'https://u7.uidownload.com/vector/666/533/vector-icon-sticker-realistic-design-on-paper-purse-vector-eps-ai.jpg',
            }}
            style={{
              width: 300,
              height: 300,
              marginBottom: 50,
            }}
          />
          <Text h4>Loading...</Text>
        </View>
      ) : (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
          <StatusBar style='light' />
          <Image
            source={{
              uri: 'https://u7.uidownload.com/vector/666/533/vector-icon-sticker-realistic-design-on-paper-purse-vector-eps-ai.jpg',
            }}
            style={{
              width: 300,
              height: 300,
              marginBottom: 50,
            }}
          />
          <View style={styles.inputContainer}>
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
              onSubmitEditing={signin}
            />
          </View>
          <Button
            title='Login'
            containerStyle={styles.button}
            onPress={signin}
          />
          <Button
            title='Register'
            containerStyle={styles.button}
            onPress={() => navigation.navigate('Register')}
          />
        </KeyboardAvoidingView>
      )}
    </>
  )
}

export default LoginScreen

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
