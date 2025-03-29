import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import FoodLoggingScreen from '../screens/FoodLoggingScreen';
import ImageRecognitionScreen from '../screens/ImageRecognitionScreen';
import ProgressTrackingScreen from '../screens/ProgressTrackingScreen';
import DietRecommendationScreen from '../screens/DietRecommendationScreen';
import SettingsScreen from '../screens/SettingScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { fontWeight: 'bold' },
          tabBarIcon: ({ color, size }) => {
            let iconName = '';

            if (route.name === 'Nhập Món') {
              iconName = 'fast-food';
            } else if (route.name === 'Nhận Diện') {
              iconName = 'camera';
            } else if (route.name === 'Tiến Độ') {
              iconName = 'stats-chart';
            } else if (route.name === 'Gợi Ý') {
              iconName = 'bulb';
            } else if (route.name === 'Cài Đặt') {
              iconName = 'settings';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#ff6347',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Nhập Món" component={FoodLoggingScreen} />
        <Tab.Screen name="Nhận Diện" component={ImageRecognitionScreen} />
        <Tab.Screen name="Tiến Độ" component={ProgressTrackingScreen} />
        <Tab.Screen name="Gợi Ý" component={DietRecommendationScreen} />
        <Tab.Screen name="Cài Đặt" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
