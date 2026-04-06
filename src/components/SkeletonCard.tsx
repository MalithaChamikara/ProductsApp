import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions } from 'react-native';

const CARD_WIDTH = (Dimensions.get('window').width - 48) / 2;

export default function SkeletonCard() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <Animated.View
      style={{
        width: CARD_WIDTH,
        margin: 6,
        opacity,
      }}
      className="bg-white rounded-2xl overflow-hidden"
    >
      {/* Image placeholder */}
      <View
        style={{ height: CARD_WIDTH }}
        className="w-full bg-gray-200"
      />
      {/* Text placeholders */}
      <View className="p-3">
        <View className="h-3 bg-gray-200 rounded-full mb-2" />
        <View className="h-3 bg-gray-200 rounded-full w-3/5 mb-3" />
        <View className="h-4 bg-green-100 rounded-full w-2/5" />
      </View>
    </Animated.View>
  );
}