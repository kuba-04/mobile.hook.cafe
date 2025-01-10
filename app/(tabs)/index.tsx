import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useState } from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker";

// Helper functions for logarithmic scale - moved to top
const logScale = (value: number) => {
  const minp = 5;
  const maxp = 100;
  const minv = Math.log(minp);
  const maxv = Math.log(maxp);
  const scale = (maxv - minv) / (maxp - minp);
  return Math.exp(minv + scale * (value - minp));
};

const invertLogScale = (value: number) => {
  const minp = 5;
  const maxp = 100;
  const minv = Math.log(minp);
  const maxv = Math.log(maxp);
  const scale = (maxv - minv) / (maxp - minp);
  return (Math.log(value) - minv) / scale + minp;
};

export default function TabOneScreen() {
  // State declarations
  const [words, setWords] = useState(['', '', '', '']);
  const [location, setLocation] = useState('');
  const [timeRange, setTimeRange] = useState({
    start: new Date().setHours(12, 0, 0, 0),
    end: new Date().setHours(14, 0, 0, 0),
  });
  const [activeTimeField, setActiveTimeField] = useState<'start' | 'end' | null>(null);
  const [budgetRange, setBudgetRange] = useState([
    invertLogScale(20),
    invertLogScale(40)
  ]);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);

  const enableScroll = () => setIsScrollEnabled(true);
  const disableScroll = () => setIsScrollEnabled(false);

  const showTimePicker = (field: 'start' | 'end') => {
    setActiveTimeField(field);
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
    setActiveTimeField(null);
  };

  const handleConfirm = (date: Date) => {
    if (activeTimeField) {
      setTimeRange(prev => ({
        ...prev,
        [activeTimeField]: date.getTime()
      }));
    }
    hideTimePicker();
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleBudgetChange = (values: number[]) => {
    setBudgetRange(values);
  };

  const displayBudget = (value: number) => {
    return Math.round(logScale(value));
  };

  return (
    <ScrollView
      className="flex-1 bg-[#1A1B1F] pt-10"
      scrollEnabled={isScrollEnabled}
    >
      <View className="p-5">
        <Text className="text-center text-2xl text-white mb-10">HOOK CAFÉ</Text>
        <Text className="text-2xl text-white mb-8">Quick meet with friendly people around?</Text>

        <View className="mb-8">
          <Text className="text-white mb-2">What do you want to talk about today?</Text>
          <Text className="text-gray-400 text-sm mb-2">(only 4 words)</Text>
          <View className="flex-row justify-between gap-2">
            {[0, 1, 2, 3].map((index) => (
              <TextInput
                key={index}
                className="flex-1 bg-white/10 rounded-lg p-3 text-white"
                placeholder={`Word ${index + 1}`}
                placeholderTextColor="#667"
                value={words[index]}
                onChangeText={(text) => {
                  const newWords = [...words];
                  newWords[index] = text;
                  setWords(newWords);
                }}
              />
            ))}
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-white mb-2">Where can you meet?</Text>
          <TextInput
            className="w-full bg-white/10 rounded-lg p-3 text-white"
            placeholder="Street or borough"
            placeholderTextColor="#667"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View className="mb-8">
          <Text className="text-white mb-2">When?</Text>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              className="flex-1 bg-white/10 rounded-lg p-3 items-center"
              onPress={() => showTimePicker('start')}
            >
              <Text className="text-white">{formatTime(timeRange.start)}</Text>
            </TouchableOpacity>
            <Text className="text-white text-lg">-</Text>
            <TouchableOpacity
              className="flex-1 bg-white/10 rounded-lg p-3 items-center"
              onPress={() => showTimePicker('end')}
            >
              <Text className="text-white">{formatTime(timeRange.end)}</Text>
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleConfirm}
            onCancel={hideTimePicker}
            date={new Date(activeTimeField === 'start' ? timeRange.start : timeRange.end)}
            is24Hour={true}
          />
        </View>

        <View className="mb-8">
          <Text className="text-white mb-2">Your food budget:</Text>
          <View className="flex-row justify-between mt-2">
            <Text className="text-white">{displayBudget(budgetRange[0])}</Text>
            <Text className="text-white">{displayBudget(budgetRange[1])}</Text>
          </View>
          <View className="items-center">
            <MultiSlider
              values={budgetRange}
              min={5}
              max={100}
              step={1}
              sliderLength={280}
              onValuesChange={handleBudgetChange}
              onValuesChangeStart={disableScroll}
              onValuesChangeFinish={enableScroll}
              selectedStyle={{
                backgroundColor: '#1DB3A8'
              }}
              unselectedStyle={{
                backgroundColor: '#ddd'
              }}
              markerStyle={{
                backgroundColor: '#1DB3A8',
                height: 20,
                width: 20,
                borderRadius: 10
              }}
            />
          </View>
        </View>

        <TouchableOpacity
          className="bg-[#1DB3A8] rounded-lg p-3 items-center mt-5"
          onPress={() => console.log('Start pressed')}
        >
          <Text className="text-white text-base">Start</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
