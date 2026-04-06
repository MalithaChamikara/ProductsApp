import React, { useEffect, useCallback, useRef, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Animated,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import debounce from 'lodash.debounce';
import Icon from 'react-native-vector-icons/Feather';

import { RootState, AppDispatch } from '../store';
import { loadProducts, searchProductsThunk } from '../store/slices/productsSlice';
import { loadCategories, selectCategory } from '../store/slices/categoriesSlice';
import { RootStackParamList } from '../types/system';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Products'>;
};

export default function ProductListScreen({ navigation }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((s: RootState) => s.products);
  const [searchQuery, setSearchQuery] = useState('');
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(loadProducts());
    dispatch(loadCategories());

    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const debouncedSearch = useCallback(
    debounce((q: string) => {
      if (q.trim().length > 0) {
        dispatch(searchProductsThunk(q.trim()));
      } else {
        dispatch(loadProducts());
      }
    }, 350),
    []
  );

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleClear = () => {
    setSearchQuery('');
    dispatch(selectCategory(null));
    dispatch(loadProducts());
  };

  const handleProductPress = (id: number) => {
    //  validate id is a safe positive integer before navigating
    if (!Number.isInteger(id) || id <= 0) return;
    navigation.navigate('Detail', { id });
  };

  const headerOpacity = headerAnim;
  const headerTranslate = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  const renderSkeleton = () => (
    <View className="flex-row flex-wrap px-2 pt-2">
      {[...Array(6)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center pt-16 px-10">
      <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
        <Icon name="package" size={36} color="#D1D5DB" />
      </View>
      <Text className="text-lg font-bold text-gray-700 mb-2">
        No products found
      </Text>
      <Text className="text-sm text-gray-400 text-center mb-6">
        Try a different search term or category filter
      </Text>
      <TouchableOpacity
        onPress={handleClear}
        className="flex-row items-center bg-green-100 px-5 py-3 rounded-full gap-2"
      >
        <Icon name="refresh-cw" size={14} color="#2D6A4F" />
        <Text className="text-sm font-semibold text-primary">
          Reset filters
        </Text>
      </TouchableOpacity>
    </View>
  );
  const renderError = () => (
    <View className="flex-1 items-center justify-center pt-16 px-10">
      <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-4">
        <Icon name="wifi-off" size={36} color="#FCA5A5" />
      </View>
      <Text className="text-lg font-bold text-gray-700 mb-2">
        Connection failed
      </Text>
      <Text className="text-sm text-gray-400 text-center mb-6">
        {error}
      </Text>
      <TouchableOpacity
        onPress={() => dispatch(loadProducts())}
        className="flex-row items-center bg-green-100 px-5 py-3 rounded-full gap-2"
      >
        <Icon name="refresh-cw" size={14} color="#2D6A4F" />
        <Text className="text-sm font-semibold text-primary">Try again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <Animated.View
        style={{
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslate }],
        }}
        className="flex-row items-center justify-between px-5 pt-4 pb-1"
      >
        <View>
          <Text className="text-xs font-semibold text-primary uppercase tracking-widest">
            Discover
          </Text>
          <Text className="text-3xl font-extrabold text-dark tracking-tight">
            Products
          </Text>
        </View>

        <View className="bg-green-100 rounded-full px-4 py-2">
          <Text className="text-sm font-bold text-primary">
            {items.length} items
          </Text>
        </View>
      </Animated.View>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearchChange}
        onClear={handleClear}
      />

      <CategoryFilter />

      {loading ? (
        renderSkeleton()
      ) : error ? (
        renderError()
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingBottom: 32,
            flexGrow: 1,
          }}
          ListEmptyComponent={renderEmpty}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => handleProductPress(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={8}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      )}
    </SafeAreaView>
  );
}