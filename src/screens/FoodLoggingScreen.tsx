import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


// Định nghĩa interface cho món ăn
interface Food {
  id: string;
  description: string;
  grams: string;
  calories: number;
}

const FoodLoggingScreen: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [grams, setGrams] = useState<string>('');
  const [foods, setFoods] = useState<Food[]>([]);
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);
  const [editingInput, setEditingInput] = useState<string>('');
  const [editingGrams, setEditingGrams] = useState<string>('');

  // Hàm tính calo (ví dụ: nhân trọng lượng với 2)
  const computeCalories = (gramsStr: string): number => {
    const weight = parseFloat(gramsStr);
    if (isNaN(weight)) return 0;
    return Math.round(weight * 2);
  };

  // Thêm món ăn mới vào danh sách
  const handleLogFood = (): void => {
    if (!input || !grams) return;
    const newFood: Food = {
      id: Date.now().toString(),
      description: input,
      grams,
      calories: computeCalories(grams),
    };
    setFoods([...foods, newFood]);
    setInput('');
    setGrams('');
  };

  // Xoá món ăn
  const handleDeleteFood = (id: string): void => {
    setFoods(foods.filter(food => food.id !== id));
  };

  // Bắt đầu chỉnh sửa món ăn
  const handleEditFood = (food: Food): void => {
    setEditingFoodId(food.id);
    setEditingInput(food.description);
    setEditingGrams(food.grams);
  };

  // Lưu chỉnh sửa món ăn
  const handleSaveEdit = (): void => {
    setFoods(foods.map(food => {
      if (food.id === editingFoodId) {
        return {
          ...food,
          description: editingInput,
          grams: editingGrams,
          calories: computeCalories(editingGrams),
        };
      }
      return food;
    }));
    setEditingFoodId(null);
    setEditingInput('');
    setEditingGrams('');
  };

  // Huỷ chỉnh sửa
  const handleCancelEdit = (): void => {
    setEditingFoodId(null);
    setEditingInput('');
    setEditingGrams('');
  };

  // Render từng món ăn, hỗ trợ cả chế độ chỉnh sửa và hiển thị
  const renderItem = ({ item }: { item: Food }) => {
    if (item.id === editingFoodId) {
      return (
        <View style={styles.foodItem}>
          <TextInput
            style={styles.editInput}
            value={editingInput}
            onChangeText={setEditingInput}
            placeholder="Tên món ăn"
          />
          <TextInput
            style={styles.editInput}
            value={editingGrams}
            onChangeText={setEditingGrams}
            placeholder="Trọng lượng (gram)"
            keyboardType="numeric"
          />
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Huỷ</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.foodItem}>
        <View style={styles.foodInfo}>
          <Text style={styles.foodDescription}>{item.description}</Text>
          <View style={styles.foodDetails}>
            <Text style={styles.foodText}>{item.grams} g</Text>
            <Text style={styles.foodCalories}>{item.calories} cal</Text>
          </View>
        </View>
        <View style={styles.foodActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleEditFood(item)}>
            <Icon name="edit" color="#2196F3" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteFood(item.id)}>
            <Icon name="delete" color="#f44336" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeText}>Chào mừng bạn đến với Nhật Ký Calories!</Text>
        <Text style={styles.subtitleText}>Hãy nhập món ăn và khối lượng của bạn để tính toán lượng calories nhanh chóng và chính xác.</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="VD: 1 bát cơm + 100g thịt gà"
          onChangeText={setInput}
          value={input}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập trọng lượng (gram)"
          keyboardType="numeric"
          onChangeText={setGrams}
          value={grams}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogFood}>
          <Text style={styles.buttonText}>Tính Calo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={foods}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.foodList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Chưa có thông tin bữa ăn</Text>
            <Text style={styles.emptyStateSubtext}>Bắt đầu nhập thực đơn của bạn ngay!</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 20,
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#e1e4e8',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  foodList: {
    marginTop: 10,
  },
  foodItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodInfo: {
    flexDirection: 'column',
  },
  foodDescription: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  foodDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodText: {
    fontSize: 16,
    color: '#666',
  },
  foodCalories: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  foodActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionButton: {
    marginLeft: 15,
  },
  editInput: {
    width: '100%',
    height: 40,
    borderColor: '#e1e4e8',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 5,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 5,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 20,
    color: '#999',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#bbb',
  },
});

export default FoodLoggingScreen;