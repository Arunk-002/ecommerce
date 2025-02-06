import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slice/productSlice"; // Make sure to replace this with your actual root reducer

const store = configureStore({
  reducer: {
    product: productReducer,
  },
});

export default store;
