import React from "react";
import "./IngredientsList.css";
import IngredientsListItem from "../IngredientsListItem/IngredientsListItem";
import { useSelector } from "react-redux";

const IngredientsList = () => {
  const ingredients = useSelector((state) => state.ingredientsList.ingredients);
  return (
    <div className="ingradientsList items-list">
      {ingredients.map((ingredient, index) => (
        <IngredientsListItem
          id={ingredient.id}
          name={ingredient.name}
          key={index}
          appendButton={false}
        />
      ))}
      <IngredientsListItem appendButton={true} />
    </div>
  );
};

export default IngredientsList;
