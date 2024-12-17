import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import HomeScreen from './screens/HomeScreen'
import AddScreen from './screens/AddScreen'
import UpdateScreen from './screens/UpdateScreen'
import AllTransactions from './screens/AllTransactions'

export default function App() {
  const Stack = createStackNavigator()

  const globalScreenOptions = {
    headerStyle: {
      backgroundColor: '#ddd5f1',
    },
    headerTitleStyle: {
      color: '#000000',
    },
    headerTintColor: '#000000',
  }
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Register' component={RegisterScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Add' component={AddScreen} />
        <Stack.Screen name='Update' component={UpdateScreen} />
        <Stack.Screen name='AllTransactions' component={AllTransactions} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
