import { View, Text } from 'react-native'
import React from 'react'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import { ChevronLeft } from 'lucide-react-native'
import { Appbar } from 'react-native-paper'
import { AppTheme } from '../theme/theme'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../navigation/rootNavigation'

interface Props extends NativeStackHeaderProps {
  title: string;
  backPage?: keyof RootStackParamList;
}

const CustomHeader = ({ title, backPage, ...props }: Props) => {
  const navigation = useNavigation<any>();

  const handleBack = () => {
    if (backPage) {
      navigation.navigate(backPage);
    } 
    else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <Appbar.Header style={{ backgroundColor: AppTheme.background }}>
      <Appbar.Action
        icon={({ size, color }) => (
          <ChevronLeft size={size} color={color} />
        )}
        onPress={handleBack}
      />
      <Appbar.Content mode='small' title={title} style={{ alignItems: 'center' }} titleStyle={{ alignSelf: 'center', color: AppTheme.primary, fontWeight: 'bold' }} />
      <Appbar.Action
        icon={() => null}
        onPress={() => { }}
      />
    </Appbar.Header>
  )
}

export default CustomHeader;