import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Text } from 'react-native-elements'
import { collection, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { StatusBar } from 'expo-status-bar'
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons'
import CustomListItem from '../components/CustomListItem'
import { getAuth, signOut } from 'firebase/auth'

const HomeScreen = ({ navigation }) => {
  const [totalIncome, setTotalIncome] = useState([])
  const [income, setIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState([])
  const [expense, setExpense] = useState(0)
  const [totalBalance, setTotalBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [filter, setFilter] = useState([])

  const signOutUser = () => {
    const auth = getAuth()
    signOut(auth)
      .then(() => {
        navigation.replace('Login')
        alert('Successfully signed out')
      })
      .catch(error => alert(error.message))
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${auth.currentUser.displayName}`,
      headerRight: () => (
        <View style={{ marginRight: 20 }}>
          <TouchableOpacity onPress={signOutUser} activeOpacity={0.5}>
            <Text style={{ fontWeight: 'bold' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      ),
    })
  }, [navigation])

  useEffect(() => {
    const collectionRef = collection(db, 'expense')
    const unsubscribe = onSnapshot(collectionRef, snapshot => {
      setTransactions(
        snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }))
      )
      setTotalIncome(
        snapshot.docs.map(doc =>
          doc.data()?.email === auth.currentUser.email &&
          doc.data()?.type === 'income'
            ? doc.data().price
            : 0
        )
      )
      setTotalExpense(
        snapshot.docs.map(doc =>
          doc.data()?.email === auth.currentUser.email &&
          doc.data()?.type === 'expense'
            ? doc.data().price
            : 0
        )
      )
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (totalIncome) {
      if (totalIncome?.length === 0) {
        setIncome(0)
      } else {
        setIncome(totalIncome?.reduce((a, b) => Number(a) + Number(b), 0))
      }
    }
    if (totalExpense) {
      if (totalExpense?.length === 0) {
        setExpense(0)
      } else {
        setExpense(totalExpense?.reduce((a, b) => Number(a) + Number(b), 0))
      }
    }
  }, [totalIncome, totalExpense, income, expense])

  useEffect(() => {
    if (income || expense) {
      setTotalBalance(income - expense)
    } else {
      setTotalBalance(0)
    }
  }, [totalIncome, totalExpense, income, expense])

  useEffect(() => {
    if (transactions) {
      setFilter(
        transactions.filter(
          transaction => transaction.data.email === auth.currentUser.email
        )
      )
    }
  }, [transactions])

  return (
    <>
      <View style={styles.container}>
        <StatusBar style='dark' />
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={{ alignItems: 'center', color: 'white' }}>
              Total Balance
            </Text>
            <Text h3 style={{ alignItems: 'center', color: 'white' }}>
              ₹{totalBalance.toFixed(2)}
            </Text>
          </View>
          <View style={styles.cardBottom}>
            <View>
              <View style={styles.cardBottomSame}>
                <Feather name='arrow-down' size={18} color='green' />
                <Text style={{ textAlign: 'center', marginLeft: 5 }}>
                  Income
                </Text>
              </View>
              <Text h4 style={{ textAlign: 'center' }}>
                ₹{income.toFixed(2)}
              </Text>
            </View>
            <View>
              <View style={styles.cardBottomSame}>
                <Feather name='arrow-up' size={18} color='red' />
                <Text style={{ textAlign: 'center', marginLeft: 5 }}>
                  Expense
                </Text>
              </View>
              <Text h4 style={{ textAlign: 'center' }}>
                ₹{expense.toFixed(2)}
              </Text>
            </View>
          </View>
          ₹
        </View>
        <View style={styles.recentTitle}>
          <Text h4>Recent Transactions</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate('AllTransactions')}
          >
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {filter.length === 0 ? (
          <View style={styles.containerNull}>
            <FontAwesome5 name='list-alt' size={24} />
            <Text>No recent transactions</Text>
          </View>
        ) : (
          <View style={styles.recentTransactions}>
            {filter?.slice(0, 3).map(info => (
              <View key={info.id}>
                <CustomListItem
                  info={info.data}
                  navigation={navigation}
                  id={info.id}
                />
              </View>
            ))}
          </View>
        )}
      </View>
      <View style={styles.addButton}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Home')}
        >
          <AntDesign name='home' size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Add')}
        >
          <AntDesign name='plus' size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate('AllTransactions')}
        >
          <FontAwesome5 name='list-alt' size={24} />
        </TouchableOpacity>
      </View>
    </>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 10,
  },
  fullName: {
    flexDirection: 'row',
  },
  card: {
    backgroundColor: 'black',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginVertical: 20,
  },
  cardTop: {
    // backgroundColor: 'blue',
    marginBottom: 20,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    margin: 'auto',
    backgroundColor: '#E0D1EA',
    borderRadius: 5,
  },
  cardBottomSame: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  recentTransactions: {
    backgroundColor: 'white',
    width: '100%',
  },
  seeAll: {
    fontWeight: 'bold',
    color: 'green',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  plusButton: {
    backgroundColor: '#535F93',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  containerNull: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
})
