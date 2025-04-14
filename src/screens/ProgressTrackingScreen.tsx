import React, { useState,useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  TouchableOpacity, 
  Modal,
  FlatList,
  Alert
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Meal,Food } from '../types/type'; // Đảm bảo bạn đã định nghĩa kiểu Meal trong types/Meal.ts
import { getMealByDateApi } from '../utils/api'; // Đảm bảo bạn đã định nghĩa hàm getMealApi trong utils/api.ts

const screenWidth = Dimensions.get('window').width;

const userID = '6619a3873a2cd2ff8e1378c1';

const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const ProgressTrackingScreen = () => {
  const [viewType, setViewType] = useState('daily');
  const [selectedDay, setSelectedDay] = useState<keyof typeof dailyDetails | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [dailyDetails, setDailyDetails] = useState<Record<string, any[]>>({});
  const [currentDayMeals, setCurrentDayMeals] = useState<any[]>([]);

  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    getMealByDateApi(todayStr, userID).then(res => {
      const mapped = mapMealsToDailyDetails(res);
      setCurrentDayMeals(mapped);
    }).catch(err => Alert.alert('Error', err.message));

    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      return d;
    });

    Promise.all(weekDates.map(d => {
      const dateStr = d.toISOString().split('T')[0];
      return getMealByDateApi(dateStr, userID);
    })).then(results => {
      const temp: Record<string, any[]> = {};
      results.forEach((meals, index) => {
        const weekday = weekDays[index];
        temp[weekday] = mapMealsToDailyDetails(meals);
      });
      setDailyDetails(temp);
    }).catch(err => Alert.alert('Error', err.message));
  }, []);

  // // Dữ liệu theo tuần
  // const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  // const weeklyData = [1200, 1500, 1700, 1800, 1600, 1400, 1550];
  
  // // Dữ liệu chi tiết cho từng ngày trong tuần
  // const dailyDetails = {
  //   'T2': [
  //     // { meal: 'Sáng', calories: 300, protein: 12, fat: 7, carbs: 35, foods: ['Bánh mì trứng', 'Sữa đậu nành'] },
  //     // { meal: 'Trưa', calories: 450, protein: 22, fat: 10, carbs: 55, foods: ['Cơm gà', 'Rau luộc', 'Canh rau'] },
  //     // { meal: 'Chiều', calories: 150, protein: 5, fat: 3, carbs: 20, foods: ['Sữa chua', 'Táo'] },
  //     // { meal: 'Tối', calories: 300, protein: 15, fat: 8, carbs: 30, foods: ['Bún thịt nướng', 'Rau sống'] },
  //   ],
  //   'T3': [
  //     // { meal: 'Sáng', calories: 350, protein: 10, fat: 8, carbs: 40, foods: ['Phở gà', 'Nước cam'] },
  //     // { meal: 'Trưa', calories: 500, protein: 20, fat: 12, carbs: 60, foods: ['Cơm sườn', 'Canh chua', 'Rau muống xào'] },
  //     // { meal: 'Chiều', calories: 200, protein: 5, fat: 4, carbs: 25, foods: ['Sữa chua', 'Chuối'] },
  //     // { meal: 'Tối', calories: 450, protein: 18, fat: 10, carbs: 50, foods: ['Bánh xèo', 'Rau sống', 'Nước ép dưa hấu'] },
  //   ],
  //   'T4': [
  //     { meal: 'Sáng', calories: 380, protein: 15, fat: 9, carbs: 42, foods: ['Bánh mì kẹp thịt', 'Nước ép cam'] },
  //     { meal: 'Trưa', calories: 520, protein: 25, fat: 15, carbs: 55, foods: ['Cơm thịt kho', 'Canh khổ qua', 'Dưa chua'] },
  //     { meal: 'Chiều', calories: 180, protein: 4, fat: 3, carbs: 28, foods: ['Yaourt', 'Hạt điều'] },
  //     { meal: 'Tối', calories: 620, protein: 30, fat: 20, carbs: 65, foods: ['Lẩu hải sản', 'Bánh tráng', 'Rau các loại'] },
  //   ],
  //   // Dữ liệu cho các ngày còn lại có thể thêm tương tự
  // };

  // // Dữ liệu theo ngày (ngày hiện tại)
  // const currentDayMeals = [
  //   { meal: 'Sáng', calories: 350, protein: 10, fat: 8, carbs: 40, foods: ['Phở gà', 'Nước cam'] },
  //   { meal: 'Trưa', calories: 500, protein: 20, fat: 12, carbs: 60, foods: ['Cơm sườn', 'Canh chua', 'Rau muống xào'] },
  //   { meal: 'Chiều', calories: 200, protein: 5, fat: 4, carbs: 25, foods: ['Sữa chua', 'Chuối'] },
  //   { meal: 'Tối', calories: 450, protein: 18, fat: 10, carbs: 50, foods: ['Bánh xèo', 'Rau sống', 'Nước ép dưa hấu'] },
  // ];

  // const currentDate = new Date().toLocaleDateString('vi-VN');
  // const totalDailyCalories = currentDayMeals.reduce((sum, meal) => sum + meal.calories, 0);

  const mapMealsToDailyDetails = (meals: Meal[]) => {
    if (!Array.isArray(meals)) return [];
    return meals.map(meal => ({
      meal: meal.mealType,
      calories: meal.totalCalories,
      protein: meal.totalProtein,
      fat: meal.totalFat,
      carbs: meal.totalCarbs,
      foods: meal.foods.map((f: Food) => f.name)
    }));
  };

  const weeklyData = weekDays.map(day => {
    const meals = dailyDetails[day] || [];
    return meals.reduce((sum, meal) => sum + meal.calories, 0);
  });

  const currentDate = new Date().toLocaleDateString('vi-VN');
  const totalDailyCalories = currentDayMeals.reduce((sum, meal) => sum + meal.calories, 0);
  
  // Xử lý khi người dùng bấm vào một ngày cụ thể trên biểu đồ tuần
  const handleDayPress = (index: number) => {
    const day = weekDays[index];
    if (dailyDetails[day as keyof typeof dailyDetails]) {
      setSelectedDay(day as keyof typeof dailyDetails);
      setModalVisible(true);
    }
  };

  // Tạo các điểm để có thể bấm vào biểu đồ
  const renderTouchablePoints = () => {
    return (
      <View style={styles.touchablePointsContainer}>
        {weeklyData.map((value, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.touchablePoint}
            onPress={() => handleDayPress(index-1)}
          />
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Theo Dõi Tiến Độ Calo</Text>
      
      {/* Tabs để chuyển đổi giữa xem theo ngày và theo tuần */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabButton, viewType === 'daily' && styles.activeTab]}
          onPress={() => setViewType('daily')}>
          <Text style={[styles.tabText, viewType === 'daily' ? styles.activeTabText : styles.inactiveTabText]}>
            Theo Ngày
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, viewType === 'weekly' && styles.activeTab]}
          onPress={() => setViewType('weekly')}>
          <Text style={[styles.tabText, viewType === 'weekly' ? styles.activeTabText : styles.inactiveTabText]}>
            Theo Tuần
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hiển thị dữ liệu theo tuần */}
      {viewType === 'weekly' ? (
        <View style={styles.chartContainer}>
          <BarChart
            data={{
              labels: weekDays,
              datasets: [{ data: weeklyData }],
            }}
            width={screenWidth - 32}
            height={220}
            yAxisLabel=""
            yAxisSuffix=" kcal"
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#6CC57C',
              backgroundGradientTo: '#4CBF77',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 12 },
              barPercentage: 0.7,
            }}
            style={styles.chart}
            showValuesOnTopOfBars={true}
            fromZero={true}
          />
          {renderTouchablePoints()}
          <Text style={styles.chartNote}>
            Tổng calo theo từng ngày trong tuần. Bấm vào cột để xem chi tiết.
          </Text>
        </View>
      ) : (
        /* Hiển thị dữ liệu theo ngày */
        <View>
          <View style={styles.dailyHeader}>
            <Text style={styles.dailyDate}>Ngày: {currentDate}</Text>
            <View style={styles.caloriesSummary}>
              <Text style={styles.totalCalories}>Tổng calo: {totalDailyCalories} kcal</Text>
            </View>
          </View>
          
          <BarChart
            data={{
              labels: currentDayMeals.map(meal => meal.meal),
              datasets: [{ data: currentDayMeals.map(meal => meal.calories) }],
            }}
            width={screenWidth - 32}
            height={220}
            yAxisLabel=""
            yAxisSuffix=" kcal"
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#3F83F8',
              backgroundGradientTo: '#60A5FA',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 12 },
              barPercentage: 0.7,
            }}
            style={styles.chart}
            showValuesOnTopOfBars={true}
            fromZero={true}
          />
          
          <Text style={[styles.chartNote, { marginBottom: 16 }]}>
            Lượng calo theo từng bữa ăn trong ngày
          </Text>
          
          {/* Danh sách các bữa ăn trong ngày */}
          {currentDayMeals.map((meal:any, index:number) => (
            <View key={index} style={styles.mealItem}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealTitle}>{meal.meal}</Text>
                <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
              </View>
              
              <View style={styles.macroNutrients}>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{meal.protein}g</Text>
                  <Text style={styles.macroLabel}>Protein</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{meal.fat}g</Text>
                  <Text style={styles.macroLabel}>Chất béo</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{meal.carbs}g</Text>
                  <Text style={styles.macroLabel}>Carbs</Text>
                </View>
              </View>
              
              <View style={styles.foodsList}>
                <Text style={styles.foodsTitle}>Món ăn:</Text>
                {meal.foods.map((food:string, foodIndex:number) => (
                  <Text key={foodIndex} style={styles.foodItem}>• {food}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Modal hiển thị chi tiết các bữa ăn của ngày được chọn */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chi tiết ngày {selectedDay}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {selectedDay && dailyDetails[selectedDay] && (
              <>
                <View style={styles.caloriesSummary}>
                  <Text style={styles.totalCalories}>
                    Tổng calo: {dailyDetails[selectedDay].reduce((sum, meal) => sum + meal.calories, 0)} kcal
                  </Text>
                </View>
                
                <FlatList
                  data={dailyDetails[selectedDay]}
                  keyExtractor={(item, index) => `meal-${index}`}
                  renderItem={({ item }) => (
                    <View style={styles.mealItem}>
                      <View style={styles.mealHeader}>
                        <Text style={styles.mealTitle}>{item.meal}</Text>
                        <Text style={styles.mealCalories}>{item.calories} kcal</Text>
                      </View>
                      
                      <View style={styles.macroNutrients}>
                        <View style={styles.macroItem}>
                          <Text style={styles.macroValue}>{item.protein}g</Text>
                          <Text style={styles.macroLabel}>Protein</Text>
                        </View>
                        <View style={styles.macroItem}>
                          <Text style={styles.macroValue}>{item.fat}g</Text>
                          <Text style={styles.macroLabel}>Chất béo</Text>
                        </View>
                        <View style={styles.macroItem}>
                          <Text style={styles.macroValue}>{item.carbs}g</Text>
                          <Text style={styles.macroLabel}>Carbs</Text>
                        </View>
                      </View>
                      
                      <View style={styles.foodsList}>
                        <Text style={styles.foodsTitle}>Món ăn:</Text>
                        {item.foods.map((food:string, foodIndex:number) => (
                          <Text key={foodIndex} style={styles.foodItem}>• {food}</Text>
                        ))}
                      </View>
                    </View>
                  )}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#f5f7fa' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginVertical: 16,
    color: '#2D3748'
  },
  tabs: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginBottom: 20,
    backgroundColor: '#E2E8F0',
    padding: 4,
    borderRadius: 12
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center'
  },
  activeTab: { 
    backgroundColor: '#4CBF77' 
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  inactiveTabText: {
    color: '#4A5568',
    fontWeight: '500'
  },
  tabText: { 
    fontSize: 15
  },
  chartContainer: {
    position: 'relative',
    alignItems: 'center'
  },
  chart: { 
    marginVertical: 12, 
    borderRadius: 12,
    paddingVertical: 8
  },
  touchablePointsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: screenWidth - 70,
    height: '100%',
    top: 0
  },
  touchablePoint: {
    width: 30,
    height: '100%',
    backgroundColor: 'transparent'
  },
  chartNote: { 
    textAlign: 'center', 
    marginVertical: 8, 
    color: '#4A5568', 
    fontStyle: 'italic',
    fontSize: 13
  },
  dailyHeader: {
    flexDirection: 'column',
    marginBottom: 12
  },
  dailyDate: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#2D3748'
  },
  caloriesSummary: {
    alignItems: 'center',
    marginVertical: 8
  },
  totalCalories: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CBF77'
  },
  mealItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  mealTitle: { 
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#2D3748'
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CBF77'
  },
  macroNutrients: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  macroItem: {
    alignItems: 'center',
    flex: 1
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3182CE'
  },
  macroLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4
  },
  foodsList: {
    marginTop: 8
  },
  foodsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#4A5568'
  },
  foodItem: {
    fontSize: 14,
    color: '#718096',
    paddingVertical: 2
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748'
  },
  closeButton: {
    padding: 4
  }
});

export default ProgressTrackingScreen;