import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const sanitizeInput = (text: string) =>
  text.replace(/[<>"'%;()&+]/g, '').slice(0, 100);

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

export default function SearchBar({ value, onChangeText, onClear }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View className={`flex-row items-center mx-4 my-2 px-4 py-3 bg-white rounded-2xl border-2 shadow-sm ${
      focused ? 'border-primary' : 'border-gray-200'
    }`}>
      <Icon name="search" size={18}
        color={focused ? '#2D6A4F' : '#9CA3AF'}
        style={{ marginRight: 10 }}
      />
      <TextInput
        className="flex-1 text-[15px] text-dark p-0"
        placeholder="Search products..."
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={t => onChangeText(sanitizeInput(t))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        maxLength={100}
        autoComplete="off"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={onClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="x" size={16} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );
}