import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Product } from '../types/product';

interface Props {
  product: Product;
  onPress: () => void;
}

const CARD_WIDTH = (Dimensions.get('window').width - 48) / 2;

const isSafeUrl = (url: string | null | undefined) => {
  if (!url) return false;
  try { return ['https:', 'http:'].includes(new URL(url).protocol); }
  catch { return false; }
};

const PLACEHOLDER = 'sample_image_url';

export default function ProductCard({ product, onPress }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start();

  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }).start();

  const imageUri = isSafeUrl(product.thumbnailUrl)
    ? product.thumbnailUrl! : PLACEHOLDER;

  return (
    <Animated.View style={{ width: CARD_WIDTH, margin: 6, transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        className="bg-white rounded-2xl overflow-hidden shadow-md"
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View>
          <Image
            source={{ uri: imageUri }}
            style={{ width: '100%', height: CARD_WIDTH }}
            className="bg-gray-100"
            resizeMode="cover"
          />
          <View className="absolute bottom-2 left-2 bg-primary/90 px-2 py-1 rounded-md">
            <Text className="text-white text-[10px] font-semibold uppercase tracking-wider"
              numberOfLines={1}>
              {product.category}
            </Text>
          </View>
        </View>

        <View className="p-3">
          <Text className="text-[13px] font-semibold text-dark leading-[18px] mb-2"
            numberOfLines={2}>
            {product.title}
          </Text>
          <View className="flex-row items-start">
            <Text className="text-primary text-xs font-bold mt-[3px]">$</Text>
            <Text className="text-primary text-lg font-extrabold leading-[22px]">
              {product.price.toFixed(2)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}