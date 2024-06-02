import { configureStore } from "@reduxjs/toolkit";
import ingredientsListSlice from "../features/ingredientsListSlice/ingredientsListSlice";
import dishesListSlice from "../features/dishesListSlice/dishesListSlice";

export default configureStore({
  reducer: {
    ingredientsList: ingredientsListSlice,
    dishesList: dishesListSlice,
  },
});
