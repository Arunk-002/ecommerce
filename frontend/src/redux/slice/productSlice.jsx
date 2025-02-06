import { createSlice } from "@reduxjs/toolkit";
const productSlice = createSlice({
    name:"Product",
    initialState:{

        products:[]
    },
    reducers:{
        setProducts:(state,action)=>{
           state.products = action.payload;
        },
        addProductData:(state,action)=>{
            state.products.push(action.payload)
        },
        editProductData:(state,action)=>{
            console.log(action);
            const index = state.products?.findIndex(product=>product._id === action.payload._id);
            state.products[index] = action.payload;
        },
        deleteProductData:(state,action)=>{
            state.products = state.products.filter(product=>product._id !== action.payload);
        }
    }
});



export const selectProducts = (state) => state.product.products;



export const {setProducts,addProductData,editProductData,deleteProductData} = productSlice.actions;
export default productSlice.reducer;