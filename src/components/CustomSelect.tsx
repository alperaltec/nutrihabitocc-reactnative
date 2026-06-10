import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Menu, TextInput, HelperText } from 'react-native-paper';
import { ChevronDown, ChevronUp, User } from 'lucide-react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { AppTheme } from '../theme/theme';

export type GeneroValue = 'Hombre' | 'Mujer' | 'Other';

interface Props {
  title?: string;
  variantText: 'displayLarge' | 'displayMedium' | 'displaySmall' | 'headlineLarge' | 'headlineMedium' | 'headlineSmall' | 'titleLarge' | 'titleMedium' | 'titleSmall' | 'bodyLarge' | 'bodyMedium' | 'bodySmall' | 'labelLarge' | 'labelMedium' | 'labelSmall';
  placeholder?: string;
  value: string;
  onValueChange: (value: GeneroValue) => void;
  errorText?: string;
}

const CustomSelect = ({ 
  title = "", 
  variantText, 
  placeholder = "Selecciona una opción", 
  value, 
  onValueChange, 
  errorText 
}: Props) => {
  const [visible, setVisible] = useState(false);
  const hasError = !!errorText;

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelect = (itemValue: GeneroValue) => {
    onValueChange(itemValue);
    closeMenu();
  };

  const getDisplayValue = (val: string) => {
    if (val === 'Other') return 'Otro';
    return val; 
  };

  return (
    <View style={{ marginHorizontal: 20, marginBottom: hasError ? 0 : verticalScale(5) }}>
      <Text variant={variantText} style={{ color: AppTheme.primary, marginBottom: verticalScale(4) }}>
        {title}
      </Text>

      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchorPosition="bottom"
        contentStyle={styles.menuContent}
        anchor={
          <Pressable onPress={openMenu}>
            <View pointerEvents="none"> 
              <TextInput
                mode="outlined"
                value={getDisplayValue(value)}
                placeholder={placeholder}
                editable={false} 
                outlineStyle={{ borderRadius: 15, backgroundColor: AppTheme.background }}
                outlineColor={AppTheme.borderColor}
                activeOutlineColor={AppTheme.borderColor}
                error={hasError}
                style={{
                  height: verticalScale(47) as number,
                  backgroundColor: AppTheme.background,
                }}
                left={
                  <TextInput.Icon
                    icon={() => <User size={scale(18)} color={AppTheme.tertiary} />}
                  />
                }
                right={
                  <TextInput.Icon
                    icon={() => visible 
                      ? <ChevronUp size={scale(18)} color={AppTheme.primary} />
                      : <ChevronDown size={scale(18)} color={AppTheme.tertiary} />
                    }
                  />
                }
              />
            </View>
          </Pressable>
        }
      >
        <Menu.Item 
          onPress={() => handleSelect('Hombre')} 
          title="Hombre" 
          titleStyle={value === 'Hombre' ? styles.selectedItem : styles.itemText}
        />
        <Menu.Item 
          onPress={() => handleSelect('Mujer')} 
          title="Mujer" 
          titleStyle={value === 'Mujer' ? styles.selectedItem : styles.itemText}
        />
        <Menu.Item 
          onPress={() => handleSelect('Other')} 
          title="Otro (Other)" 
          titleStyle={value === 'Other' ? styles.selectedItem : styles.itemText}
        />
      </Menu>

      {hasError && (
        <HelperText type='error' visible={hasError} style={{ paddingLeft: 4 }}>
          {errorText}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menuContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    marginTop: verticalScale(4),
    borderColor: '#E5E7EB',
    borderWidth: 1,
    elevation: 4,
  },
  itemText: {
    color: '#4B5563',
    fontSize: scale(14),
  },
  selectedItem: {
    color: AppTheme.primary,
    fontWeight: 'bold',
    fontSize: scale(14),
  }
});

export default CustomSelect;