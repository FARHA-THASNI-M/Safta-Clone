import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dummyData } from '../slice/dummydata';

interface Item {
  id: number;
  title: string;
  description: string;
}

interface DataState {
  items: Item[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  currentPage: number;
  hasMore: boolean;
}

const initialState: DataState = {
  items: [],
  status: 'idle',
  currentPage: 1,
  hasMore: true,
};

export const fetchData = createAsyncThunk<Item[], number>(
  'data/fetchData',
  async (page) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const itemsPerPage = 9; 
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = dummyData.slice(start, end);

    return pageItems;
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchData.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.status = 'succeeded';
        state.items = [...state.items, ...action.payload];
        state.hasMore = action.payload.length > 0;
        state.currentPage += 1;
      })
      .addCase(fetchData.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default dataSlice.reducer;
export const selectData = (state: { data: DataState }) => state.data.items;
export const selectStatus = (state: { data: DataState }) => state.data.status;
export const selectHasMore = (state: { data: DataState }) => state.data.hasMore;
