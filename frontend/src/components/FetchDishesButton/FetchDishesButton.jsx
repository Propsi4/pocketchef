import React, { useState } from "react";
import "./FetchDishesButton.css";
import { useDispatch, useSelector } from "react-redux";
import { addDish, clear } from "../../features/dishesListSlice/dishesListSlice";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const FetchDishesButton = () => {
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(false);
  const [show, setShow] = useState(false);
  const ingredients = useSelector((state) =>
    state.ingredientsList.ingredients.map((ingredient) => ingredient.name)
  );

  const fetchDishes = async (e, ingredients) => {
    e.preventDefault();
    if (ingredients.length === 0 || ingredients[0] === "") {
      setShow(true);
      return;
    }
    setFetching(true);
    try {
      const response = await fetch(
        "http://localhost:8000/api/chat/fetch_dishes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ingredients }), // Fix: Add JSON.stringify to correctly format the body
        }
      );
      const data = await response.json();
      const dishes = data.chatgpt_response?.dishes;
      console.log(dishes);
      if (!dishes) {
        alert("No dishes found with these ingredients");
        setFetching(false);
        return;
      }
      dispatch(clear());
      dishes.forEach((dish) => {
        dispatch(addDish(dish));
      });
    } catch (error) {
      console.log(error);
    }
    setFetching(false);
  };

  return (
    <>
      <button
        className="fetchDishesButton"
        disabled={fetching}
        onClick={(e) => fetchDishes(e, ingredients)}
      >
        Fetch dishes
      </button>

      <Modal show={show} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You must select at least one ingredient to fetch dishes. Or there are
          no dishes available with the selected ingredients.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShow(false)}>
            Understood
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FetchDishesButton;
