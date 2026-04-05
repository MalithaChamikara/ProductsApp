import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProducts,searchProducts,fetchByCategory } from "../../api/productsApi";
import { Product } from "../../types/Product";

interface ProductsState {
    items: Product[];
    loading: boolean;
    error: string | null;
}

// Initial state for the products slice
const initialState: ProductsState = {
    items: [],
    loading: false,
    error: null,
}

export const loadProducts = createAsyncThunk('products/load', async () => {
    const response = await fetchProducts();
    return response.data as Product[];
});

export const searchProductsThunk = createAsyncThunk('products/search',async (q:string) => {
    const response = await searchProducts(q);
    return response.data as Product[]
})

export const loadByCategory = createAsyncThunk('products/byCategory',async (slug:string) => {
    const response = await fetchByCategory(slug)
    return response.data as Product[]
})

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers:{},
    extraReducers:builder => {
        const handlePending =   (s:ProductsState) => {s.loading = true, s.error = null;};
        const handleRejected = (s:ProductsState,r:any) => {s.loading = false, s.error = r.error?.message ?? "Failed";};
        const handleFullfilled = (s:ProductsState,r:any) => {s.loading = false,s.items = r.payload;};

        builder
            .addCase(loadProducts.pending,handlePending)
            .addCase(loadProducts.fulfilled,handleFullfilled)
            .addCase(loadProducts.rejected,handleRejected)
            .addCase(searchProductsThunk.pending,handlePending)
            .addCase(searchProductsThunk.fulfilled,handleFullfilled)
            .addCase(searchProductsThunk.rejected,handleRejected)
            .addCase(loadByCategory.pending,handlePending)
            .addCase(loadByCategory.fulfilled,handleFullfilled)
            .addCase(loadByCategory.rejected,handleRejected)

    }
})

export default productsSlice.reducer;