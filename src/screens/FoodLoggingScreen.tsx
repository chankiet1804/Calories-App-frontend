import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  Modal,
  StatusBar,
  Dimensions,
  TextInput,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getFoodApi, getFoodByNameApi,createMealApi } from '../utils/api'; 
import { Food, Meal } from '../types/type'; 


const { width, height } = Dimensions.get('window');

const FoodLoggingScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [availableFoods, setAvailableFoods] = useState<Food[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('main_dish');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [totalNutrition, setTotalNutrition] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  });

  const [meal, setMeal] = useState<Meal>();

  // Danh sách các category có sẵn
  const categories = [ 'main_dish', 'vegetables', 'snack', 'drink', 'dessert'];
  
  // Lấy dữ liệu món ăn
  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        setLoading(true);
        const data = await getFoodApi();
        if(data) {
          console.log("Dữ liệu món ăn:", data);
          setAvailableFoods(data);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoodList();
  }, []);

  // Tìm kiếm món ăn theo tên
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      setIsSearchMode(true);
      const results = await getFoodByNameApi(searchQuery);
      if (results) {
        console.log("Kết quả tìm kiếm:", results);
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setSearchResults([]);
    } finally {
      setLoading(false); 
    }
  };

  // Reset tìm kiếm và quay lại chế độ xem theo category
  const resetSearch = () => {
    setSearchQuery('');
    setIsSearchMode(false);
    setSearchResults([]);
  };

  // Lọc món ăn theo category đã chọn
  const filteredFoods = availableFoods.filter(food => food.category.includes(selectedCategory));

  // Hiển thị danh sách món ăn (kết quả tìm kiếm hoặc theo category)
  const displayedFoods = isSearchMode ? searchResults : filteredFoods;

  // Thêm món ăn vào danh sách đã chọn
  const handleSelectFood = (food: Food) => {
    if (!selectedFoods.find(item => item._id === food._id)) {
      const newSelectedFoods = [...selectedFoods, food];
      setSelectedFoods(newSelectedFoods);
      calculateTotalNutrition(newSelectedFoods);
    }
  };

  // Xoá món ăn khỏi danh sách đã chọn
  const handleRemoveSelectedFood = (id: string) => {
    const newSelectedFoods = selectedFoods.filter(food => food._id !== id);
    setSelectedFoods(newSelectedFoods);
    calculateTotalNutrition(newSelectedFoods);
  };

  // Tính tổng các chỉ số dinh dưỡng của các món đã chọn
  const calculateTotalNutrition = (foods = selectedFoods) => {
    const total = foods.reduce(
      (acc, food) => ({
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        fat: acc.fat + food.fat,
        carbs: acc.carbs + food.carbs,
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
    setTotalNutrition(total);
  };

  // Render một món ăn trong danh sách có sẵn
  const renderFoodItem = ({ item }: { item: Food }) => (
    <TouchableOpacity 
      style={styles.foodItem} 
      onPress={() => handleSelectFood(item)}
    >
      <View style={styles.foodImageContainer}>
        <View style={styles.foodImagePlaceholder}>
          <Icon name="fastfood" size={24} color="#fff" />
        </View>
      </View>
      <View style={styles.foodContent}>
        <Text style={styles.foodName} numberOfLines={1}>
          {item.name}{' '}
          <Text style={styles.foodWeight}>
            {item.weight} {item.unit}
          </Text>
        </Text>
        <View style={styles.nutritionRow}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{item.calories}</Text>
            <Text style={styles.nutritionLabel}>Calo</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{item.protein}g</Text>
            <Text style={styles.nutritionLabel}>Protein</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{item.fat}g</Text>
            <Text style={styles.nutritionLabel}>Chất béo</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{item.carbs}g</Text>
            <Text style={styles.nutritionLabel}>Tinh bột</Text>
          </View>
        </View>
      </View>
      <View style={styles.addButtonContainer}>
        <Icon name="add-circle" size={24} color="#3498db" />
      </View>
    </TouchableOpacity>
  );

  // Render một món ăn trong danh sách đã chọn
  const renderSelectedFoodItem = ({ item }: { item: Food }) => (
    <View style={styles.selectedFoodItem}>
      <View style={styles.selectedFoodImageContainer}>
        <View style={styles.selectedFoodImagePlaceholder}>
          <Icon name="fastfood" size={20} color="#fff" />
        </View>
      </View>
      <View style={styles.selectedFoodContent}>
        <Text style={styles.selectedFoodName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.selectedFoodNutrition}>
          {item.calories} calo | {item.protein}g protein | {item.fat}g chất béo | {item.carbs}g tinh bột
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.removeButton} 
        onPress={() => handleRemoveSelectedFood(item._id)}
      >
        <Icon name="remove-circle" size={24} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );

  // Render header tổng kết chỉ số dinh dưỡng
  const renderNutritionSummary = () => (
    <View style={styles.nutritionSummary}>
      <View style={styles.summaryCard}>
        <Icon name="local-fire-department" size={20} color="#e74c3c" />
        <Text style={styles.summaryValue}>{totalNutrition.calories}</Text>
        <Text style={styles.summaryLabel}>Calo</Text>
      </View>
      <View style={styles.summaryCard}>
        <Icon name="fitness-center" size={20} color="#3498db" />
        <Text style={styles.summaryValue}>{totalNutrition.protein}g</Text>
        <Text style={styles.summaryLabel}>Protein</Text>
      </View>
      <View style={styles.summaryCard}>
        <Icon name="opacity" size={20} color="#f39c12" />
        <Text style={styles.summaryValue}>{totalNutrition.fat}g</Text>
        <Text style={styles.summaryLabel}>Chất béo</Text>
      </View>
      <View style={styles.summaryCard}>
        <Icon name="grain" size={20} color="#2ecc71" />
        <Text style={styles.summaryValue}>{totalNutrition.carbs}g</Text>
        <Text style={styles.summaryLabel}>Tinh bột</Text>
      </View>
    </View>
  );

  const handleSubmitMeal = async () => {
    const userID = '6619a3873a2cd2ff8e1378c1'; // hardcoded cho ví dụ
    const mealType = 'snack';
  
    const mealData: Meal = {
      userID,
      mealType,
      foods: selectedFoods,
      totalCalories: totalNutrition.calories,
      totalProtein: totalNutrition.protein,
      totalFat: totalNutrition.fat,
      totalCarbs: totalNutrition.carbs,
      date: new Date().toISOString(),
    };
  
    try {
      const results = await createMealApi(mealData);
  
      Alert.alert('Đã lưu vào thực đơn!');
      setModalVisible(false);
    } catch (error) {
      console.error('Lỗi khi lưu meal:', error);
      Alert.alert('Có lỗi xảy ra!');
    }
  };


  // Modal hiển thị danh sách món ăn đã chọn
  const renderSelectedFoodsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Món ăn đã chọn ({selectedFoods.length})</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Icon name="close" size={24} color="#2c3e50" />
            </TouchableOpacity>
          </View>
          
          {renderNutritionSummary()}
          
          {selectedFoods.length > 0 ? (
            <FlatList
              data={selectedFoods}
              keyExtractor={item => item._id}
              renderItem={renderSelectedFoodItem}
              style={styles.modalFoodsList}
            />
            
          ) : (
            <View style={styles.emptyStateContainer}>
              <Icon name="restaurant" size={50} color="#ddd" />
              <Text style={styles.emptyStateText}>Chưa chọn món ăn nào</Text>
            </View>
          )}
          
          <TouchableOpacity
          style={[styles.doneButton,{ backgroundColor: selectedFoods.length > 0 ? '#2ecc71' : '#bdc3c7' },]}
          onPress={() => {
            if (selectedFoods.length > 0) {
              handleSubmitMeal(); // hàm gửi dữ liệu lên server
            } else {
              setModalVisible(false); // đóng modal nếu chưa chọn món
            }
          }}
        >
          <Text style={styles.doneButtonText}>
            {selectedFoods.length > 0
              ? 'Thêm vào thực đơn hôm nay của bạn'
              : 'Mời bạn lựa chọn món ăn'}
          </Text>
        </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );

  // Render thanh tìm kiếm
  const renderSearchBar = () => (
    <View style={styles.searchBarContainer}>
      <View style={styles.searchInputContainer}>
        <Icon name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập tên món ăn..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="cancel" size={20} color="#bdc3c7" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity 
        style={styles.searchButton}
        onPress={handleSearch}
      >
        <Text style={styles.searchButtonText}>Tìm kiếm</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Nhật ký ăn uống</Text>
        <TouchableOpacity 
          style={styles.basketButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="shopping-basket" size={24} color="#fff" />
          {selectedFoods.length > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{selectedFoods.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Hiển thị tổng dinh dưỡng */}
      {renderNutritionSummary()}

      {/* Thanh tìm kiếm */}
      {renderSearchBar()}

      {/* Hiển thị thông tin tìm kiếm và nút quay lại */}
      {isSearchMode && (
        <View style={styles.searchStatusContainer}>
          <Text style={styles.searchStatusText}>
            Kết quả tìm kiếm: {searchResults.length} món
          </Text>
          <TouchableOpacity 
            style={styles.resetSearchButton}
            onPress={resetSearch}
          >
            <Icon name="arrow-back" size={16} color="#3498db" />
            <Text style={styles.resetSearchText}>Quay lại danh mục</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Danh mục món ăn - Ẩn khi đang ở chế độ tìm kiếm */}
      {!isSearchMode && (
        <View style={styles.categoriesContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  selectedCategory === item && styles.selectedCategoryButton,
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === item && styles.selectedCategoryButtonText,
                  ]}
                >
                  {item.replace('_', ' ').toUpperCase()}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.categoriesScroll}
          />
        </View>
      )}

      {/* Danh sách món ăn theo category hoặc kết quả tìm kiếm */}
      <View style={styles.availableFoodsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {isSearchMode ? 'Kết quả tìm kiếm' : 'Danh sách món ăn'}
          </Text>
          <Text style={styles.sectionSubtitle}>{displayedFoods.length} món</Text>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Đang tải...</Text>
          </View>
        ) : displayedFoods.length > 0 ? (
          <FlatList
            data={displayedFoods}
            keyExtractor={item => item._id}
            renderItem={renderFoodItem}
            style={styles.foodsList}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <Icon name="no-meals" size={50} color="#ddd" />
            <Text style={styles.emptyStateText}>
              {isSearchMode ? 'Không tìm thấy món ăn phù hợp' : 'Không có món ăn trong danh mục này'}
            </Text>
          </View>
        )}
      </View>

      {/* Button hiển thị danh sách đã chọn ở dưới cùng */}
      <TouchableOpacity 
        style={styles.viewSelectedButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.viewSelectedButtonText}>
          Xem danh sách món đã chọn ({selectedFoods.length})
        </Text>
        <Icon name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Modal hiển thị danh sách món ăn đã chọn */}
      {renderSelectedFoodsModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  header: {
    backgroundColor: '#3498db',
    paddingTop: StatusBar.currentHeight || 0,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  basketButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  nutritionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    width: '23%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginVertical: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  searchBarContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#2c3e50',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchStatusText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  resetSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetSearchText: {
    marginLeft: 4,
    color: '#3498db',
    fontWeight: '600',
  },
  categoriesContainer: {
    marginBottom: 10,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: '#ecf0f1',
    marginRight: 10,
  },
  selectedCategoryButton: {
    backgroundColor: '#3498db',
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  selectedCategoryButtonText: {
    color: '#fff',
  },
  availableFoodsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 16,
    marginBottom: 80, // Để không che phủ nút dưới cùng
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  foodsList: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
    padding: 12,
    alignItems: 'center',
  },
  foodImageContainer: {
    marginRight: 12,
  },
  foodImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodContent: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  foodWeight: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c3e50',
  },
  nutritionLabel: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  addButtonContainer: {
    paddingLeft: 5,
  },
  viewSelectedButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  viewSelectedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.85,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFoodsList: {
    marginVertical: 15,
    maxHeight: height * 0.5,
  },
  selectedFoodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  selectedFoodImageContainer: {
    marginRight: 12,
  },
  selectedFoodImagePlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedFoodContent: {
    flex: 1,
  },
  selectedFoodName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  selectedFoodNutrition: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  removeButton: {
    paddingHorizontal: 5,
  },
  emptyStateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    marginTop: 10,
    fontSize: 16,
    color: '#95a5a6',
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  }
});

export default FoodLoggingScreen;