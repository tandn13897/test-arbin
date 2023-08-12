import { createSlice } from "@reduxjs/toolkit";
import { DataState,  } from "../type/table-type";

const initialState: DataState = {
    dataList: [],
}

const dataSlice = createSlice({
    name: 'Data',
    initialState,
    reducers: {},
    extraReducers: {},
})

const dataReducer = dataSlice.reducer;

export default dataReducer;