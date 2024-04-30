import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems:localStorage.getItem('cartItems') ? 
    JSON.parse(localStorage.getItem('cartItems')) :
     [],
};

export const cartSlice = createSlice({
    initialState,
    name:"cartSlice",
    reducers:{
        setCartItem: (state, action) => {
            const item = action.payload;

            const isItemExist = state.cartItems.find(
                (i) => i.product === item.product
            );
            if(isItemExist){
                //update the value of cart
                state.cartItems = state.cartItems.map((i) =>
                i.product === isItemExist.product ? item : i
            );
            } else{
                //create new item
                state.cartItems = [...state.cartItems,item]
            }

            localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
        },
        removeCartItem:(state,action) => {
            state.cartItems = state?.cartItems?.filter(
                (i) => i.product !== action.payload
            );
        },
    },
});

export default cartSlice.reducer;

export const { setCartItem, removeCartItem } = cartSlice.actions