import React from 'react';
import { StyleSheet, View, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar } from 'react-native-paper';
import { scale, verticalScale } from 'react-native-size-matters';
import { ChevronRight } from 'lucide-react-native'; // Aprovechando la librería que ya tienes instalada
import { AppTheme } from '../theme/theme';

interface CustomCardInfoProps {
  title: string;
  subtitle: string;
  extraDetail?: string; // Opcional: Para correos, fechas o IDs
  imageSource?: ImageSourcePropType;
  isActive?: boolean;   // Opcional: Muestra el punto verde de conexión
  onPress?: () => void; // Opcional: Hace que la tarjeta sea clickeable
}

const CustomCardInfo = ({ 
  title, 
  subtitle, 
  extraDetail, 
  imageSource, 
  isActive = false, 
  onPress 
}: CustomCardInfoProps) => {
  
  // Envolvemos el contenido en un TouchableOpacity solo si pasamos la función onPress
  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <Card mode="elevated" style={styles.card}>
      <CardContainer onPress={onPress} activeOpacity={0.7}>
        <Card.Content style={styles.content}>

          <View style={styles.avatarContainer}>
            {imageSource ? (
              <Avatar.Image source={imageSource} size={scale(65)} style={styles.avatar} />
            ) : (
              <Avatar.Icon icon="account" size={scale(65)} style={styles.avatar} />
            )}

            {isActive && <View style={styles.activeDot} />}
          </View>
          <View style={styles.textContainer}>
            <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            
            <Text variant="bodyMedium" style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
            
            {extraDetail && (
              <Text variant="labelSmall" style={styles.extraDetail} numberOfLines={1}>
                {extraDetail}
              </Text>
            )}
          </View>

          {onPress && (
            <View style={styles.actionIcon}>
              <ChevronRight color="#999999" size={scale(20)} />
            </View>
          )}

        </Card.Content>
      </CardContainer>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: scale(15),
    marginTop: verticalScale(15),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(16), 
    elevation: 3,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
  },
  avatarContainer: {
    position: 'relative',
    marginRight: scale(15),
  },
  avatar: {
    backgroundColor: AppTheme.primary + '20', 
  },
  activeDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: scale(14),
    height: scale(14),
    borderRadius: scale(7),
    backgroundColor: '#4CAF50', 
    borderWidth: 2,
    borderColor: '#FFFFFF', 
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    color: '#1F2937', 
    marginBottom: verticalScale(2),
  },
  subtitle: {
    color: AppTheme.primary, 
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  extraDetail: {
    color: '#6B7280', 
    marginTop: verticalScale(2),
  },
  actionIcon: {
    marginLeft: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomCardInfo;