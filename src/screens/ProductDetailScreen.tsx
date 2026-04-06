import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { fetchProductById } from '../api/productsApi';
import  {ProductDetail} from '../types/product';
import { RootStackParamList } from '../types/system';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Detail'>;
  route: RouteProp<RootStackParamList, 'Detail'>;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.9;

// only render images from safe protocols
const isSafeUrl = (url: string | null | undefined): url is string => {
  if (!url) return false;
  try {
    const p = new URL(url);
    return p.protocol === 'https:' || p.protocol === 'http:';
  } catch {
    return false;
  }
};

const PLACEHOLDER =
  'sample_image_url'; 


const INFO_PILLS = [
  { icon: 'shield',     label: 'Secure checkout' },
  { icon: 'refresh-cw', label: 'Easy returns'    },
  { icon: 'truck',      label: 'Fast delivery'   },
];

export default function ProductDetailScreen({ navigation, route }: Props) {
  const { id } = route.params;

  const safeId = Number.isInteger(id) && id > 0 ? id : null;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const scrollY   = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    if (!safeId) {
      setError('Invalid product ID.');
      setLoading(false);
      return;
    }

    let cancelled = false; 

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchProductById(safeId);

        if (!cancelled) {
          setProduct(res.data);
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start();
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message ?? 'Failed to load product.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; }; // cleanup on unmount
  }, [safeId]);

  const imageTranslate = scrollY.interpolate({
    inputRange: [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
    outputRange: [IMAGE_HEIGHT / 2, 0, -IMAGE_HEIGHT / 3],
    extrapolate: 'clamp',
  });

  const headerBg = scrollY.interpolate({
    inputRange: [0, IMAGE_HEIGHT - 80],
    outputRange: ['rgba(249,250,251,0)', 'rgba(249,250,251,1)'],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [IMAGE_HEIGHT - 100, IMAGE_HEIGHT - 40],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2D6A4F" />
        <Text className="mt-4 text-sm text-gray-400">Loading product...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 px-8">
        <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-4">
          <Icon name="alert-circle" size={36} color="#FCA5A5" />
        </View>
        <Text className="text-lg font-bold text-gray-700 mb-2">
          Something went wrong
        </Text>
        <Text className="text-sm text-gray-400 text-center mb-6">{error}</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex-row items-center bg-green-100 px-6 py-3 rounded-full gap-2"
        >
          <Icon name="arrow-left" size={15} color="#2D6A4F" />
          <Text className="text-sm font-semibold text-primary">Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageUri = isSafeUrl(product.thumbnailUrl)
    ? product.thumbnailUrl!
    : PLACEHOLDER;

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <Animated.View
        style={{ backgroundColor: headerBg, position: 'absolute',
          top: 0, left: 0, right: 0, zIndex: 10 }}
        className="flex-row items-center px-4 pt-12 pb-3 gap-3"
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-white/90 items-center justify-center shadow"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="arrow-left" size={20} color="#1A1A2E" />
        </TouchableOpacity>

        <Animated.Text
          style={{ opacity: headerTitleOpacity }}
          className="flex-1 text-base font-bold text-dark"
          numberOfLines={1}
        >
          {product.title}
        </Animated.Text>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{ height: IMAGE_HEIGHT, overflow: 'hidden' }}
          className="bg-gray-200"
        >
          <Animated.Image
            source={{ uri: imageUri }}
            style={{
              width: SCREEN_WIDTH,
              height: IMAGE_HEIGHT + 60,
              top: -30,
              transform: [{ translateY: imageTranslate }],
            }}
            resizeMode="cover"
          />
          <View
            style={{
              ...{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
              backgroundColor: 'rgba(0,0,0,0.08)',
            }}
          />
        </View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="bg-gray-50 rounded-t-3xl -mt-7 px-6 pt-7 pb-12"
        >
          <View className="flex-row items-center gap-1 bg-green-100 self-start px-3 py-1.5 rounded-lg mb-3">
            <Icon name="tag" size={11} color="#2D6A4F" />
            <Text className="text-xs font-semibold text-primary uppercase tracking-wider">
              {product.category}
            </Text>
          </View>

          <Text className="text-2xl font-extrabold text-dark leading-8 tracking-tight mb-5">
            {product.title}
          </Text>

          <View className="bg-green-50 rounded-2xl p-4 mb-5">
            <Text className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
              Price
            </Text>
            <View className="flex-row items-start">
              <Text className="text-lg font-bold text-primary mt-1">$</Text>
              <Text className="text-4xl font-extrabold text-primary leading-[44px]">
                {product.price.toFixed(2)}
              </Text>
            </View>
          </View>

          <View className="h-px bg-gray-200 mb-5" />

          <View className="mb-6">
            <Text className="text-base font-bold text-dark mb-3">
              About this product
            </Text>
            {product.description ? (
              <Text className="text-sm text-gray-500 leading-6">
                {product.description}
              </Text>
            ) : (
              <Text className="text-sm text-gray-300 italic">
                No description available.
              </Text>
            )}
          </View>

          <View className="flex-row flex-wrap gap-2 mb-7">
            {INFO_PILLS.map(pill => (
              <View
                key={pill.icon}
                className="flex-row items-center gap-1.5 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full"
              >
                <Icon name={pill.icon as any} size={13} color="#2D6A4F" />
                <Text className="text-xs font-medium text-gray-600">
                  {pill.label}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            className="flex-row items-center justify-center gap-3 bg-primary py-5 rounded-2xl"
            activeOpacity={0.85}
            style={{
              shadowColor: '#2D6A4F',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.35,
              shadowRadius: 10,
              elevation: 6,
            }}
          >
            <Icon name="shopping-cart" size={19} color="#FFFFFF" />
            <Text className="text-base font-bold text-white tracking-wide">
              Add to Cart
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 mt-3 py-4 rounded-2xl border-2 border-gray-200"
            activeOpacity={0.75}
          >
            <Icon name="heart" size={17} color="#6B7280" />
            <Text className="text-sm font-semibold text-gray-500">
              Save to wishlist
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}
