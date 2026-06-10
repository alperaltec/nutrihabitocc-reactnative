import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { scale, verticalScale } from 'react-native-size-matters';

interface CustomStatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;   
}

const CustomStatCard = ({ title, value, icon, color }: CustomStatCardProps) => {
  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content style={styles.content}>

        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          {icon}
        </View>

        <Text variant="headlineMedium" style={[styles.value, { color }]}>
          {value}
        </Text>
        
        <Text variant="labelMedium" style={styles.title} numberOfLines={1}>
          {title}
        </Text>

      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1, 
    backgroundColor: '#FFFFFF',
    borderRadius: scale(16),
    margin: scale(5),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  content: {
    alignItems: 'flex-start',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(12),
  },
  iconContainer: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  value: {
    fontWeight: 'bold',
    marginBottom: verticalScale(2),
  },
  title: {
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
  }
});

export default CustomStatCard;