import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { scale, verticalScale } from 'react-native-size-matters';
import { AppTheme } from '../theme/theme';

export interface CustomAlertProps {
  visible: boolean;
  title: string;
  description: string;
  icon?: React.ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const CustomAlert = ({
  visible,
  title,
  description,
  icon,
  onConfirm,
  onCancel,
  confirmText = "Aceptar",
  cancelText = "Cancelar"
}: CustomAlertProps) => {
  return (
    <Portal>
      <Dialog 
        visible={visible} 
        onDismiss={onCancel ? onCancel : onConfirm}
        style={styles.dialog}
      >
        <Dialog.Content style={styles.content}>
          {icon && (
            <View style={styles.iconContainer}>
              {icon}
            </View>
          )}
          
          <Text variant="titleLarge" style={styles.title}>
            {title}
          </Text>
          
          <Text variant="bodyMedium" style={styles.description}>
            {description}
          </Text>
        </Dialog.Content>

        <Dialog.Actions style={styles.actions}>
          {onCancel && (
            <Button 
              mode="text" 
              textColor={AppTheme.tertiary} 
              onPress={onCancel}
              style={styles.btn}
            >
              {cancelText}
            </Button>
          )}

          <Button 
            mode="contained" 
            buttonColor={AppTheme.primary} 
            textColor={AppTheme.surface}
            onPress={onConfirm}
            style={[styles.btn, { minWidth: scale(100) }]}
          >
            {confirmText}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: AppTheme.surface,
    borderRadius: 20, // Bordes curvos modernos que combinan con tus inputs
    marginHorizontal: scale(25),
  },
  content: {
    alignItems: 'center', // Centra todo el contenido visual
    paddingTop: verticalScale(20),
  },
  iconContainer: {
    marginBottom: verticalScale(12),
  },
  title: {
    color: AppTheme.tertiary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  description: {
    color: AppTheme.onBackground,
    textAlign: 'center',
    paddingHorizontal: scale(10),
    opacity: 0.8,
  },
  actions: {
    justifyContent: 'center', 
    paddingBottom: verticalScale(15),
    paddingHorizontal: scale(20),
    gap: scale(10),
  },
  btn: {
    borderRadius: 12,
  }
});

export default CustomAlert;