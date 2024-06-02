from Model import Model
from fastapi import FastAPI, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Dict, Optional

from ImageURLSearch import ImageURLSearch
from FlashCardGenerator import FlashCardGenerator
from ChatGPTAPI import ChatGPTAPI
from load_config import CHATGPT_TOKEN, CLASSES
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
model = Model()
chatgpt = ChatGPTAPI(CHATGPT_TOKEN)
cards_generator = FlashCardGenerator()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Dish(BaseModel):
    dish_name: str
    country: str
    required_ingredients: List[str]
    cook_time: int
    description: str
    allergens: List[str]
    image_url: Optional[str] = None


class IngredientsRequest(BaseModel):
    ingredients: List[str]


class SearchImageRequest(BaseModel):
    search_query: str


class FetchDishesResponse(BaseModel):
    ingredients: str
    chatgpt_response: Optional[Dict[str, List[Dict]]]


@app.post("/api/images/generate_card")
def generate_card(dish: Dish) -> FileResponse:
    '''
    Generate a flashcard for the dish

    Args:
        dish (Dish): The dish details

    Returns:
        FileResponse: The flashcard image
    '''
    print(dish.model_dump())
    card = cards_generator.generate_flashcard(dish.model_dump())
    card.save("flashcard.png")
    return FileResponse("flashcard.png", media_type="image/png")


@app.get("/api/images/about")
def about() -> Dict[str, List[str]]:
    '''
    Get the available classes

    Returns:
        Dict[str, List[str]]: The dictionary containing the available classes
    '''
    return {'classes': CLASSES}


@app.post("/api/images/predict")
def predict_image(image: UploadFile) -> Dict[str, List]:
    '''
    Use object detection to extract the classes from an image

    Args:
        image (UploadFile): The image to predict

    Returns:
        Dict[str, List]: The dictionary containing the ingredients
    '''
    return {'ingredients': model.predict(image)}


@app.get("/api/images/search")
def search_image(data: SearchImageRequest) -> Dict[str, Optional[str]]:
    '''
    Search for an image URL for the item

    Args:
        data (SearchImageRequest): The name of the item to search for

    Returns:
        Dict[str, Optional[str]]: The dictionary containing the image URL. None if no URL is found
    '''
    return {'image_url': ImageURLSearch.get_valid_image_url(data.search_query)}


@app.post("/api/chat/fetch_dishes")
def fetch_dishes(data: IngredientsRequest) -> FetchDishesResponse:
    '''
    Fetch the dishes using the ChatGPT API

    Args:
        ingredients (List[str]): The list of ingredients

    Returns:
        FetchDishesResponse: The dictionary of dishes if the API response is successful. None if the API response is unsuccessful
    '''
    ingredients = chatgpt.format_ingredients(data.ingredients)
    chatgpt_response = chatgpt.fetch_dishes(ingredients)
    return {"ingredients": ingredients, "chatgpt_response": chatgpt_response}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
