import { createSlice } from "@reduxjs/toolkit";

const ingredientsListSlice = createSlice({
  name: "ingredientsList",
  initialState: {
    ingredients: [],
    extractableIngredients: [],
  },
  reducers: {
    setExtractableIngredients(state, action) {
        state.extractableIngredients = action.payload;
    },
    addIngredient(state, action) {
      const id = Date.now();
      const name = action.payload;
      if (state.ingredients.length === 0) {
        state.ingredients.push({ name, id });
      } else if (state.ingredients[state.ingredients.length - 1]?.name !== "") {
        state.ingredients.push({ name, id });
      }
    },
    removeIngredient(state, action) {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    clear(state) {
      state.ingredients = [];
    },
    changeText(state, action) {
      const id = action.payload.id;
      const name = action.payload.name;
      state.ingredients = state.ingredients.map((ingredient) => {
        if (ingredient.id === id) {
          ingredient.name = name;
        }
        return ingredient;
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addIngredient,
  removeIngredient,
  clear,
  changeText,
  getIngredients,
  setExtractableIngredients,
} = ingredientsListSlice.actions;

export default ingredientsListSlice.reducer;
