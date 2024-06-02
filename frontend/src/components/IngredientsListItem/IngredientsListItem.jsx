import React from "react";
import styles from "./IngredientsListItem.module.css";
import { useDispatch } from "react-redux";
import {
  addIngredient,
  removeIngredient,
  changeText,
} from "../../features/ingredientsListSlice/ingredientsListSlice";

const IngredientsListItem = ({
  id = null,
  name = "",
  appendButton = false,
}) => {
  const dispatch = useDispatch();
  const handleChange = (event) => {
    const { value } = event.target;
    const regex = /^[a-zA-Z ]*$/;
    if (regex.test(value)) {
      dispatch(changeText({ id, name: value }));
    }
  };

  const handleRemove = () => {
    dispatch(removeIngredient(id));
  };

  const handleAdd = () => {
    dispatch(addIngredient(""));
  };

  return (
    <div
      className={styles.ingredientItem}
      style={{ cursor: appendButton ? "pointer" : "default" }}
      onClick={() => {
        if (appendButton) {
          handleAdd();
        }
      }}
    >
      {appendButton ? (
        <button className={styles.ingredientItemAddButton}>+</button>
      ) : (
        <>
          <input
            type="text"
            maxLength="15"
            className={styles.ingredientItemInput}
            value={name}
            onChange={handleChange}
          />
          <button
            className={styles.ingredientItemRemoveButton}
            onClick={handleRemove}
          >
            X
          </button>
        </>
      )}
    </div>
  );
};

export default IngredientsListItem;
