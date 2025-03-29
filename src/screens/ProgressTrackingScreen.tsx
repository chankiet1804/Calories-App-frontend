import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressTrackingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Theo Dõi Tiến Độ</Text>
      <Text>Biểu đồ tiêu thụ calo theo ngày/tuần sẽ hiển thị ở đây.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 20 },
});

export default ProgressTrackingScreen;
