import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const ImageRecognitionScreen = () => {
  const handleCaptureImage = () => {
    // Tạm thời hiển thị thông báo. Sau này tích hợp camera và API nhận diện ảnh.
    Alert.alert('Thông báo', 'Chức năng chụp ảnh đang được phát triển');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhận Diện Ảnh Món Ăn</Text>
      <Button title="Chụp Ảnh Bữa Ăn" onPress={handleCaptureImage} />
      <Text style={styles.info}>Chức năng nhận diện ảnh sẽ được tích hợp sau.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 20 },
  info: { marginTop: 20, fontSize: 16, textAlign: 'center' },
});

export default ImageRecognitionScreen;
