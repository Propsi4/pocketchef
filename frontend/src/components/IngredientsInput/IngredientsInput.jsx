import React, { useState } from "react";
import IngredientsList from "../IngredientsList/IngredientsList";
import FileUpload from "../FileUpload/FileUpload";
import FetchDishesButton from "../FetchDishesButton/FetchDishesButton";
import { Modal, Button } from "react-bootstrap";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setExtractableIngredients } from "../../features/ingredientsListSlice/ingredientsListSlice";

const IngredientsInput = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const extractableIngredients = useSelector(
    (state) => state.ingredientsList.extractableIngredients
  );

  const fetchExtractableIngredients = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/images/about",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      dispatch(setExtractableIngredients(data.classes));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExtractableIngredients();
  }, []);

  return (
    <div>
      <div className="smaller title" onClick={() => setShow(true)} style={{cursor: 'pointer'}}>Ingredients</div>
      <FileUpload></FileUpload>
      <IngredientsList/>
      <FetchDishesButton />

      <Modal show={show} animation={true}>
        <Modal.Header>
          <Modal.Title>Available classes</Modal.Title>
        </Modal.Header>
        <Modal.Body>Available classes that can be extracted from a photo:
          <ul>
            {extractableIngredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default IngredientsInput;
