import requests


class Dish:
    def __init__(self, name: str, country: str, ingredients: dict, description: str,
                 image_url: str = None):
        self.name = name
        self.country = country
        self.ingredients = ingredients
        self.description = description
        self.image_url = self.get_image() if image_url is None else image_url

    def get_image(self):
        if self.image_url:
            return requests.get(self.image_url).content
        return None
