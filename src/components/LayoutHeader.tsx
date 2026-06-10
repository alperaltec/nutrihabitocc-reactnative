import { View, Text, StyleSheet } from 'react-native'
import React, { ReactNode } from 'react'
import { AppTheme } from '../theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';


interface Props {
  children: ReactNode;
}

const LayoutHeader = ({children}:Props) => {
  return (
    <SafeAreaView style={styles.main}>
      {children}
    </SafeAreaView>
  )
}

export default LayoutHeader


const styles = StyleSheet.create({
  main: {
    backgroundColor: AppTheme.background,
    flex: 1,
  },
})