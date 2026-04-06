import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { selectCategory } from '../store/slices/categoriesSlice';
import { loadProducts, loadByCategory } from '../store/slices/productsSlice';

export default function CategoryFilter() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, selected } = useSelector((s: RootState) => s.categories);

  const handleSelect = (slug: string | null) => {
    dispatch(selectCategory(slug));
    if (slug === null) {
      dispatch(loadProducts());
    } else {
      const valid = items.find(c => c.slug === slug);
      if (valid) dispatch(loadByCategory(slug));
    }
  };

  const allCategories = [{ id: 0, name: 'All', slug: null as any }, ...items];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}
    >
      {allCategories.map(cat => {
        const isActive = selected === cat.slug;
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => handleSelect(cat.slug)}
            className={`px-4 py-2 rounded-full border-2 ${
              isActive
                ? 'bg-primary border-primary'
                : 'bg-gray-100 border-gray-200'
            }`}
            activeOpacity={0.75}
          >
            <Text className={`text-[13px] font-semibold ${
              isActive ? 'text-white' : 'text-gray-500'
            }`}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}