import { View, Text, StyleSheet } from 'react-native'
import React, { ReactNode } from 'react'
import { AppTheme } from '../theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';


interface Props {
  children: ReactNode;
}

const Layout = ({children}:Props) => {
  return (
    <View style={styles.main}>
      {children}
    </View>
  )
}

export default Layout


const styles = StyleSheet.create({
  main: {
    backgroundColor: AppTheme.background,
    flex: 1,
  },
})