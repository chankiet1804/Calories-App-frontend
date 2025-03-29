import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DietRecommendationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gợi Ý Thực Đơn</Text>
      <Text>Gợi ý thực đơn cá nhân hóa sẽ hiển thị ở đây.</Text>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 20 },
});

export default DietRecommendationScreen;
