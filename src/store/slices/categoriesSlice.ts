import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCategories } from "../../api/productsApi";
import { Category } from "../../types/Category";

interface CategoriesState {
    items: Category[];
    selected: string|null;
    loading: boolean;
    error: string | null;
}

// Initial state for the categories slice
const initialState: CategoriesState = {
    items: [],
    selected: null,
    loading: false,
    error: null,
}

export const loadCategories = createAsyncThunk('categories/load', async () => {
    const response = await fetchCategories();
    return response.data as Category[];
});



const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers:{
        selectCategory:(state,action) => {
            state.selected = action.payload;
        }
    },
    extraReducers:builder => {
        const handlePending =   (s:CategoriesState) => {s.loading = true, s.error = null;};
        const handleRejected = (s:CategoriesState,r:any) => {s.loading = false, s.error = r.error?.message ?? "Failed";};
        const handleFullfilled = (s:CategoriesState,r:any) => {s.loading = false,s.items = r.payload;};

        builder
            .addCase(loadCategories.pending,handlePending)
            .addCase(loadCategories.fulfilled,handleFullfilled)
            .addCase(loadCategories.rejected,handleRejected)

    }
})

export const {selectCategory} = categoriesSlice.actions;
export default categoriesSlice.reducer;