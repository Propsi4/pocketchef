import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./DishViewModal.css";

const DishViewModal = ({ show, setShow, dish }) => {
  const fetchCard = async (dish) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/images/generate_card",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dish), // Fix: Add JSON.stringify to correctly format the body
        }
      );
      const image = await response.blob();
      const url = URL.createObjectURL(image);

      // Create a link element
      const link = document.createElement("a");
      link.href = url;
      const dish_name = dish.dish_name.replace(/ /g, "_");
      link.download = `flashcard_${dish_name}.jpg`; // Set the filename for download
      document.body.appendChild(link);
      link.click(); // Programmatically trigger a click
      document.body.removeChild(link); // Clean up by removing the link element

      // Release the object URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="dishViewModal">
      {dish && (
        <Modal
          show={show}
          onHide={() => {
            setShow(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>{dish.dish_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {dish.description}
            <img
              className="dishImg"
              src={dish.image_url}
              alt={dish.dish_name}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => fetchCard(dish)}>
              Download Flash Card
            </Button>
            <Button variant="primary" onClick={() => setShow(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default DishViewModal;
