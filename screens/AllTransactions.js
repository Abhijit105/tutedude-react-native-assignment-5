import React, { useState, useLayoutEffect, useEffect } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import CustomListItem from '../components/CustomListItem'
import { db, auth } from '../firebase'
import { Text } from 'react-native-elements'
import { FontAwesome5 } from '@expo/vector-icons'
import { collection, orderBy, query } from 'firebase/firestore'
import { SafeAreaView } from 'react-native-safe-area-context'
import { onSnapshot } from 'firebase/firestore'

const AllTransactions = ({ navigation }) => {
  const [transactions, setTransactions] = useState([])
  const [filter, setFilter] = useState([])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'All Transactions',
    })
  }, [])

  useEffect(() => {
    // Create a query
    const q = query(collection(db, 'expense'), orderBy('timestamp', 'desc'))

    // Set up the listener
    const unsubscribe = onSnapshot(q, snapshot => {
      setTransactions(
        snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    })

    // Cleanup the listener
    return unsubscribe
  }, [])

  useEffect(() => {
    if (!transactions) return
    setFilter(
      transactions.filter(item => item.data.email === auth.currentUser.email)
    )
  }, [transactions])

  return (
    <>
      {filter.length === 0 ? (
        <View style={styles.containerNull}>
          <FontAwesome5 name='list-alt' size={24} />
          <Text h4 style={{ color: 'green' }}>
            No Transactions
          </Text>
        </View>
      ) : (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            {filter?.map(info => (
              <View key={info.id}>
                <CustomListItem
                  id={info.id}
                  info={info.data}
                  navigation={navigation}
                />
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  )
}

export default AllTransactions

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 0,
    marginTop: -23,
  },
  containerNull: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
