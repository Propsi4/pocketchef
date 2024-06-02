import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  clear,
  addIngredient,
} from "../../features/ingredientsListSlice/ingredientsListSlice";
import { Discuss } from "react-loader-spinner";
import styles from "./FileUpload.module.css";

const FileUpload = () => {
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const fileInput = useRef(null);

  const fetchIngredients = async (e, file) => {
    e.preventDefault();
    setFileUploaded(false);
    fileInput.current.value = "";
    setFetching(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await fetch("http://localhost:8000/api/images/predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const ingredients = data.ingredients;
      if (ingredients.length === 0) {
        alert("No ingredients found in the image");
        setFetching(false);
        return;
      }
      dispatch(clear());
      ingredients.forEach((ingredient) => {
        dispatch(addIngredient(ingredient));
      });
    } catch (error) {
      console.log(error);
    }
    setFetching(false);
  };

  const handleFileChange = (event) => {
    if (!event.target.files.length) {
      setFileUploaded(false);
      return;
    }
    setFileUploaded(true);
    // Handle the file upload logic here
  };
  return (
    <form
      id={styles.FileUpload}
      onSubmit={(e) => fetchIngredients(e, fileInput.current.files[0])}
    >
      <div className={styles.wrapper}>
        {fetching ? (
          <div className={styles.loader}>
            <Discuss
              visible={true}
              height="80"
              width="80"
              ariaLabel="discuss-loading"
              wrapperStyle={{}}
              wrapperClass="discuss-wrapper"
              color="#fff"
              backgroundColor="#E59A59"
            />
          </div>
        ) : (
          <>
            <div className={styles.upload}>
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                ref={fileInput}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="fileInput" className={styles.upload_button}>
                {fileUploaded ? `Change` : "Upload"}
              </label>
            </div>
            {fileUploaded && (
              <>
                <button
                  type="submit"
                  id={styles.fileSubmit}
                  className={styles.submit_button}
                >
                  Submit
                </button>
              </>
            )}
          </>
        )}
      </div>
    </form>
  );
};

export default FileUpload;
