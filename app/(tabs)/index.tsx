import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TabOneScreen() {
  const [words, setWords] = useState(['', '', '', '']);
  const [location, setLocation] = useState('');
  const [timeRange, setTimeRange] = useState({
    start: new Date().setHours(12, 0, 0, 0),
    end: new Date().setHours(14, 0, 0, 0),
  });
  const [activeTimeField, setActiveTimeField] = useState<'start' | 'end' | null>(null);
  const [budget, setBudget] = useState(30);

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setActiveTimeField(null);
    if (selectedDate) {
      setTimeRange((prev: { start: number; end: number }) => ({
        ...prev,
        [activeTimeField!]: selectedDate.getTime()
      }));
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <ScrollView className="flex-1 bg-[#1A1B1F] pt-10">
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
              onPress={() => setActiveTimeField('start')}
            >
              <Text className="text-white">{formatTime(timeRange.start)}</Text>
            </TouchableOpacity>
            <Text className="text-white text-lg">-</Text>
            <TouchableOpacity
              className="flex-1 bg-white/10 rounded-lg p-3 items-center"
              onPress={() => setActiveTimeField('end')}
            >
              <Text className="text-white">{formatTime(timeRange.end)}</Text>
            </TouchableOpacity>
          </View>
          {activeTimeField && (
            <DateTimePicker
              value={new Date(activeTimeField === 'start' ? timeRange.start : timeRange.end)}
              mode="time"
              is24Hour={true}
              onChange={handleTimeChange}
            />
          )}
        </View>

        <View className="mb-8">
          <Text className="text-white mb-2">Your food budget:</Text>
          <Slider
            className="w-full h-10"
            minimumValue={20}
            maximumValue={40}
            value={budget}
            onValueChange={setBudget}
            minimumTrackTintColor="#1DB3A8"
            maximumTrackTintColor="#ddd"
            thumbTintColor="#1DB3A8"
          />
          <View className="flex-row justify-between mt-2">
            <Text className="text-white">20</Text>
            <Text className="text-white">40</Text>
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
