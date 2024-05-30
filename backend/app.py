from Model import Model
from fastapi import FastAPI, UploadFile
from typing import Dict
import io
from PIL import Image
from ImageSearch import ImageSearch

app = FastAPI()
model = Model()


@app.post("/api/predict")
def predict(image: UploadFile) -> Dict[str, int]:
    # Load the image
    image_data = image.file.read()
    image = Image.open(io.BytesIO(image_data)).convert('RGB')
    return model.predict(image)


if __name__ == "__main__":
    image_search = ImageSearch()
    results = image_search.get_valid_image_url("pizza")
    print(results)
    # import uvicorn
    # uvicorn.run(app, host="localhost", port=8000)
