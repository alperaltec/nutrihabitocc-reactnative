import { View, Text, StyleSheet } from 'react-native'
import React, { ReactNode } from 'react'
import { AppTheme } from '../theme/theme';

interface Props {
  children: ReactNode;
}

const LayoutRegister = ({ children }: Props) => {
  return (
    <View style={styles.main}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: AppTheme.background,
    flex: 1
  },
})

export default LayoutRegister