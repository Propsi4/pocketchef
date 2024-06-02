import { createSlice } from "@reduxjs/toolkit";

const dishesListSlice = createSlice({
  name: "dishesList",
  initialState: {
    dishes: [],
    filter: {},
  },
  reducers: {
    addDish(state, action) {
      const id = Date.now();
      let dish = action.payload;
      dish.id = id;
      state.dishes.push(dish);
    },
    removeDish(state, action) {
      state.dishes = state.dishes.filter((dish) => dish.id !== action.payload);
    },
    clear(state) {
      state.dishes = [];
    },
    modifyFilter(state, action) {
      const filter_key = action.payload.filter_key;
      const filter_value = action.payload.filter_value;
      if (filter_value === "none") {
        delete state.filter[filter_key];
      } else {
        state.filter[filter_key] = filter_value;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { addDish, removeDish, clear, modifyFilter } =
  dishesListSlice.actions;

export default dishesListSlice.reducer;
