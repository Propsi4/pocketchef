import React, { useState } from "react";
import "./DishesList.css";
import { useSelector } from "react-redux";
import DishesListItem from "../DishesListItem/DishesListItem";
import { filterDishes } from "../../utils/utils";
import DishViewModal from "../DishViewModal/DishViewModal";

const DishesList = () => {
  const dishes = useSelector((state) => state.dishesList.dishes);
  const filter = useSelector((state) => state.dishesList.filter);
  const [showModal, setShowModal] = useState(false);
  const [currentDish, setCurrentDish] = useState(null);
  return (
    <div>
      <div className="items-list dishesList">
        {filterDishes(dishes, filter).map((dish, index) => (
          <DishesListItem
            dish={dish}
            key={index}
            setShowModal={setShowModal}
            setCurrentDish={setCurrentDish}
          />
        ))}
      </div>
      <DishViewModal
        show={showModal}
        setShow={setShowModal}
        dish={currentDish}
      />
    </div>
  );
};

export default DishesList;
