import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { TextInput, Text, Menu, SegmentedButtons, Card } from 'react-native-paper';
import { AppTheme } from '../theme/theme'; 

export const InputField = ({ label, value, onChangeText, multiline, keyboardType, editable = true }: any) => (
  <View style={styles.fieldContainer}>
    <Text variant="labelLarge" style={[styles.label, { color: AppTheme.tertiary }]}>{label}</Text>
    <TextInput
      mode="outlined"
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      keyboardType={keyboardType}
      editable={editable} 
      outlineColor={AppTheme.borderColor}
      activeOutlineColor={AppTheme.primary}
      outlineStyle={{ borderRadius: 12 }}
      style={{ backgroundColor: editable ? AppTheme.background : AppTheme.surfaceVariant }}
    />
  </View>
);


export const SelectField = ({ label, value, onValueChange, options, editable = true }: any) => {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.fieldContainer}>
      <Text variant="labelLarge" style={[styles.label, { color: AppTheme.tertiary }]}>{label}</Text>
      <Menu
        visible={visible && editable} 
        onDismiss={() => setVisible(false)}
        anchor={
          <Pressable onPress={() => editable && setVisible(true)}> 
            <TextInput
              mode="outlined"
              value={value}
              editable={false} 
              placeholder="Seleccionar..."
              right={editable ? <TextInput.Icon icon={visible ? 'chevron-up' : 'chevron-down'} color={AppTheme.tertiary} /> : null} // Ocultamos la flecha si es solo lectura
              outlineColor={AppTheme.borderColor}
              activeOutlineColor={AppTheme.primary}
              outlineStyle={{ borderRadius: 12 }}
              style={{ backgroundColor: editable ? AppTheme.background : AppTheme.surfaceVariant }}
            />
          </Pressable>
        }
      >
        {options.map((opt: string) => (
          <Menu.Item 
            key={opt} 
            onPress={() => { onValueChange(opt); setVisible(false); }} 
            title={opt} 
            titleStyle={{ color: AppTheme.tertiary }}
          />
        ))}
      </Menu>
    </View>
  );
};

export const ComplexField = ({ label, value, onChange, editable = true }: any) => {
  const isYes = value.padece === 'Sí' || value.consume === 'Sí';
  const typeKey = value.padece !== undefined ? 'padece' : 'consume';

  return (
    <Card style={[styles.card, { backgroundColor: AppTheme.surface }]} mode="outlined">
      <Card.Content>
        <Text variant="titleSmall" style={[styles.cardTitle, { color: AppTheme.tertiary }]}>{label}</Text>
        <SegmentedButtons
          value={value[typeKey] || 'No'}
          onValueChange={(val) => editable && onChange({ ...value, [typeKey]: val, frecuencia: val === 'No' ? '' : value.frecuencia })}
          buttons={[{ value: 'Sí', label: 'Sí' }, { value: 'No', label: 'No' }]}
          theme={{ colors: { secondaryContainer: AppTheme.primary, onSecondaryContainer: '#FFFFFF' } }}
        />
        {isYes && (
          <TextInput
            mode="outlined"
            label="Detalles / Frecuencia"
            value={value.frecuencia}
            onChangeText={(txt) => editable && onChange({ ...value, frecuencia: txt })}
            editable={editable} 
            style={{ marginTop: 10, backgroundColor: editable ? AppTheme.background : AppTheme.surfaceVariant }}
            outlineColor={AppTheme.borderColor}
            activeOutlineColor={AppTheme.primary}
          />
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  fieldContainer: { marginBottom: 15 },
  label: { marginBottom: 5, marginLeft: 4 },
  card: { marginBottom: 15, borderColor: AppTheme.outline },
  cardTitle: { marginBottom: 10, fontWeight: 'bold' }
});