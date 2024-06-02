import React from "react";
import styles from "./DishesListItem.module.css";

const DishesListItem = ({ dish, setShowModal, setCurrentDish }) => {
  const handleOpen = () => {
    setCurrentDish(dish);
    setShowModal(true);
  };
  return (
    <div className={styles.dishListItem} onClick={() => handleOpen()}>
      <div className={styles.dishImageContainer}>
        <img
          className={styles.dishImage}
          src={dish.image_url}
          alt={dish.dish_name}
        />
      </div>
      <div className={styles.dishAbout}>
        <div className={styles.dishName}>{dish.dish_name}</div>
        <table className={styles.dishInfo}>
          <tbody>
            <tr>
              <td className={styles.dishInfoLabel}>Country:</td>
              <td>{dish.country}</td>
            </tr>
            <tr>
              <td className={styles.dishInfoLabel}>Ingredients:</td>
              <td>{dish.required_ingredients.join(", ")}</td>
            </tr>
            <tr>
              <td className={styles.dishInfoLabel}>Cook time:</td>
              <td>{dish.cook_time} minutes</td>
            </tr>
            <tr>
              <td className={styles.dishInfoLabel}>Allergens:</td>
              <td>{dish.allergens}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DishesListItem;
