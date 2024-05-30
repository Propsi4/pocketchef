from Model import Model
from fastapi import FastAPI, UploadFile
from typing import Dict
import io
from PIL import Image
from ImageURLSearch import ImageURLSearch

app = FastAPI()
model = Model()


@app.post("/api/predict")
def predict(image: UploadFile) -> Dict[str, int]:
    # Load the image
    image_data = image.file.read()
    image = Image.open(io.BytesIO(image_data)).convert('RGB')
    return model.predict(image)


if __name__ == "__main__":
    image_search = ImageURLSearch()
    results = image_search.get_valid_image_url("TNTU Ternopil National Technical University")
    print(results)
    # import uvicorn
    # uvicorn.run(app, host="localhost", port=8000)
