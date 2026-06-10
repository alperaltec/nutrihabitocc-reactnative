import { View } from 'react-native'
import React, { useState } from 'react'
import { HelperText, Text, TextInput, TextInputProps } from 'react-native-paper';
import { AppTheme } from '../theme/theme';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react-native';
import { verticalScale } from 'react-native-size-matters';

interface Props extends TextInputProps {
  title?: string;
  variantText: 'displayLarge' | 'displayMedium' | 'displaySmall' | 'headlineLarge' | 'headlineMedium' | 'headlineSmall' | 'titleLarge' | 'titleMedium' | 'titleSmall' | 'bodyLarge' | 'bodyMedium' | 'bodySmall' | 'labelLarge' | 'labelMedium' | 'labelSmall';
  errorText?: string;
  isPassword?: boolean;
}

const CustomInput = ({ title = "", variantText, errorText, isPassword = false, ...props }: Props) => {
  const [secureText, setSecureText] = useState(isPassword);
  
  const hasError = !!errorText;

  return (
    <View style={{ marginHorizontal: 20, marginBottom: hasError ? 0 : verticalScale(5) }}>
      <Text variant={variantText} style={{ color: AppTheme.primary, marginBottom: verticalScale(4) }}>
        {title}
      </Text>
      <TextInput
        mode="outlined"
        {...props}
        secureTextEntry={secureText}
        outlineStyle={{ borderRadius: 15, backgroundColor: AppTheme.background }}
        outlineColor={AppTheme.borderColor}
        activeOutlineColor={AppTheme.borderColor}
        error={hasError}
        style={{
          height: verticalScale(47) as number,
          backgroundColor: AppTheme.background,
        }}
        left={
          isPassword ? (
            <TextInput.Icon
              icon={() => <LockKeyhole size={20} color={AppTheme.tertiary} />}
            />
          ) : null
        }
        right={
          isPassword ? (
            <TextInput.Icon
              onPress={() => setSecureText(!secureText)}
              icon={() => secureText ?
                <Eye size={20} color={AppTheme.primary} /> :
                <EyeOff size={20} color={AppTheme.tertiary} />
              }
            />
          ) : null
        }
      />
      
      {hasError && (
        <HelperText type='error' visible={hasError} style={{ paddingLeft: 4 }}>
          {errorText}
        </HelperText>
      )}
    </View>
  )
}

export default CustomInput;