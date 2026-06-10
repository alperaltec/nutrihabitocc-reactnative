import { View, StyleSheet, useWindowDimensions, KeyboardAvoidingView, Platform, Image } from 'react-native'
import React, { ReactNode } from 'react'
import { AppTheme } from '../theme/theme'
import Svg, { Path } from 'react-native-svg';
import { verticalScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  children: ReactNode
}

const BackgroundShapes = () => {
  const { width, height } = useWindowDimensions();

  return (
    <Svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
      <Path
        d="M 0 0 C 30 6, 70 0, 100 11 V 0 H 0 Z"
        fill={AppTheme.primary}
        opacity={0.78}
      />
      <Path
        d="M 0 0 C 20 14, 60 10, 100 18 V 0 H 0 Z"
        fill={AppTheme.primary}
        opacity={0.82}
      />
    </Svg>
  );
};

const LayoutAuth = ({ children }: Props) => {
  const logoNutri = require('../assets/logonutri.png');
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.main}>
    
      <View style={[styles.canvas, { marginTop: insets.top }]}>
        <BackgroundShapes />
      </View>
      
      
      <View style={[styles.logoContainer, { top: insets.top + verticalScale(85) }]}>
         <Image 
           source={logoNutri} 
           style={styles.logo} 
           resizeMode="contain" 
         />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.content, { marginTop: insets.top + verticalScale(255) }]}
      >
        {children}
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: AppTheme.background,
    flex: 1
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
  },
  logo: {
    width: verticalScale(185),  
    height: verticalScale(185),
  },
  logoContainer: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
  },
})

export default LayoutAuth;