from UnlimitedGPT import ChatGPT
from UnlimitedGPT.internal.objects import DefaultAccount
from typing import Optional
from ImageURLSearch import ImageURLSearch
import warnings
import json
from time import sleep

INSTRUCTIONS_TEMPLATE = '''
Task:
Imagine you're a function designed to process a list of ingredients and generate a JSON response containing information about dishes that can be prepared using those ingredients.

Input Format:
The input will be a comma-separated string of ingredients in the format: "<Ingredient1>,<Ingredient2>,<Ingredient3>,..."

Output Format:
Your response should be in JSON format and structured as follows:
{
  "dishes": [
    {
      "dish_name": "<DishName>",
      "country": "<DishCountryFrom>",
      "required_ingredients": ["<RequiredIngredient1>", ..., "<RequiredIngredientN>"],
      "cook_time": <CookTime>,
      "description": "<ShortDishDescription>",
      "allergens": ["<Allergen1>", ..., "<AllergenN>"]
    },
    ...
  ]
}

Explanation of Tags:
<IngredientN>: Name of an ingredient (string type).
<RequiredIngredientN>: Name of an ingredient required to cook the dish. It should be a subset of the provided ingredients and should not include any extra ingredients (string type inside an array).
<DishName>: Name of the dish (string type).
<DishCountryFrom>: Country of origin for the dish (string type).
<CookTime>: Time required to cook the dish in minutes (integer type).
<ShortDishDescription>: A brief description of the dish (string type).
<AllergenN>: Name of an allergen associated with any of the required ingredients.
Only include allergens if they are present in the required ingredients list (string type inside an array).

Instructions:
Ensure that allergens are only listed if they are present in the required ingredients list,
and required ingredients are not listed if they are not included in the provided ingredients list.

Let's begin. Ask me for the first ingredients list.'''


class ChatGPTAPI():
    '''
    A class to interact with the ChatGPT API

    Attributes:
        _sesion_token (str): The session token for the ChatGPT API
        model (ChatGPT): The ChatGPT model
        manual_chatting (bool): Whether the user is manually chatting
        _conversation_id (str): The conversation ID
        _proxy (str): The proxy
        image_search (ImageURLSearch): The ImageURLSearch object
        _instructions_mentioned (bool): Whether the instructions have been mentioned
        _temporary_chat (bool): Whether the chat is temporary

    Methods:
        format_ingredients(ingredients): Format the ingredients
        fetch_dishes(ingredients): Fetch the dishes
        parse_json(json_str): Parse the JSON string
        toggle_chat_history(temporary_chat): Toggle the chat history
        get_user_data(): Get the user data from the ChatGPT API
    '''
    def __init__(self, sesion_token, conversation_id="", proxy=None, manual_chatting=False):
        self._sesion_token = sesion_token
        self.model = None
        self.manual_chatting = manual_chatting
        self._conversation_id = conversation_id
        self._proxy = proxy
        self.image_search = ImageURLSearch()
        self._instructions_mentioned = False
        self._temporary_chat = False

    def format_ingredients(self, ingredients: list) -> str:
        '''
        Format the ingredients

        Args:
            ingredients (list): The list of ingredients

        Returns:
            str: The formatted ingredients
        '''
        if not ingredients:
            warnings.warn("No ingredients provided", UserWarning)
            return ""

        ingredients = [ingradient.strip() for ingradient in ingredients]
        ingredients = [ingradient for ingradient in ingredients if ingradient]
        return ",".join(ingredients)

    def fetch_dishes(self, ingredients: str) -> Optional[dict]:
        '''
        Chat with the ChatGPT API

        Args:
            ingredients (str): Formatted ingredients

        Returns:
            Optional[dict]: The dictionary of dishes if the API response is successful. None if the API response is unsuccessful
        '''
        if not ingredients:
            warnings.warn("No ingredients provided", UserWarning)
            return None

        if self.manual_chatting:
            if not self._instructions_mentioned:
                print(f'\n{INSTRUCTIONS_TEMPLATE}\n')
                self._instructions_mentioned = True
            print("Ingredients:", ingredients, end="\n\n")
            response = input("Response: ")
            json_response = self.parse_json(response)
            dishes = json_response.get("dishes")
            if dishes:
                for dish in dishes:
                    dish_name = dish.get("dish_name")
                    dish.update({"image_url": self.image_search.get_valid_image_url(dish_name)})
            return json_response

        if not self.model:
            self.model = ChatGPT(self._sesion_token, conversation_id=self._conversation_id, proxy=self._proxy)

        if not self._instructions_mentioned:
            api_response = self.model.send_message(INSTRUCTIONS_TEMPLATE)
            if api_response.failed:
                warnings.warn("Instructions not mentioned", UserWarning)
                self._instructions_mentioned = False
                return None
            self._instructions_mentioned = True

        api_response = self.model.send_message(ingredients)

        if not api_response.failed:
            json_response = self.parse_json(api_response.response)
            dishes = json_response.get("dishes")
            if dishes:
                for dish in dishes:
                    dish_name = dish.get("dish_name")
                    dish.update({"image_url": self.image_search.get_valid_image_url(dish_name)})
            return json_response
        else:
            return None

    def parse_json(self, json_str: str) -> dict:
        '''
        Parse the JSON string

        Args:
            json_str (str): The JSON string

        Returns:
            dict: The parsed JSON
        '''
        if not json_str:
            warnings.warn("No JSON string provided", UserWarning)
            return {}

        first_bracket = json_str.find("{")
        last_bracket = json_str.rfind("}")
        json_str = json_str[first_bracket:last_bracket + 1]

        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            warnings.warn("Invalid JSON string provided", UserWarning)
            return {}

    def toggle_chat_history(self, temporary_chat: bool) -> None:
        '''
        Toggle the chat history

        Args:
            temporary_chat (bool): Whether to keep the chat history or not
        '''
        self._temporary_chat = temporary_chat
        self.model.toggle_chat_history(temporary_chat)

    def get_user_data(self) -> Optional[DefaultAccount]:
        '''
        Get the user data from the ChatGPT API

        Returns:
            DefaultAccount: The user data
        '''
        return self.model.get_user_data()
