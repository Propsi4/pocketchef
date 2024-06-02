from PIL import Image, ImageDraw, ImageFont
import requests
from io import BytesIO
import textwrap


class FlashCardGenerator:
    '''
    FlashCardGenerator class is used to generate flashcards for dishes.

    Attributes:
        width (int): Width of the flashcard.
        height (int): Height of the flashcard.
        background_color (tuple): Background color of the flashcard.
        text_color (tuple): Text color of the flashcard.
        font_path (str): Path to the font file.

    Methods:
        generate_flashcard(dish_data: dict) -> Image: Generates a flashcard for the dish.
    '''
    def __init__(self, width=800, height=600, background_color=(255, 255, 255), text_color=(0, 0, 0), font_path="./Roboto-Medium.ttf"):
        self.width = width
        self.height = height
        self.background_color = background_color
        self.text_color = text_color
        self.font_path = font_path

    def generate_flashcard(self, dish_data: dict) -> Image:
        '''
        Generates a flashcard for the dish.

        Args:
            dish_data (dict): A dictionary containing the details of the dish.

        Returns:
            Image: A flashcard image for the dish.
        '''
        if not dish_data:
            return None
        # Create a new image with white background
        card = Image.new("RGB", (self.width, self.height), self.background_color)
        draw = ImageDraw.Draw(card)

        # Load font
        font_text = ImageFont.truetype(self.font_path, 20)

        # Fetch and paste the image
        if dish_data.get("image_url"):
            response = requests.get(dish_data["image_url"])
            dish_image = Image.open(BytesIO(response.content))
            dish_image = dish_image.resize((self.width, 300))
            card.paste(dish_image, (0, 0))

        # Define text content
        text_content = [
            f"Dish Name: {dish_data.get('dish_name', 'N/A')}",
            f"Country: {dish_data.get('country', 'N/A')}",
            f"Cook Time: {dish_data.get('cook_time', 'N/A')} minutes",
            "Ingredients: " + ", ".join(dish_data.get("required_ingredients", ['N/A'])),
            f"Description: {dish_data.get('description', 'N/A')}",
            "Allergens: " + ", ".join(dish_data.get("allergens", ['N/A']))
        ]

        # Draw text on the card
        y_position = 320

        for line in text_content:
            if line.startswith("Description: "):
                # Wrap description text to fit within the specified width
                wrapped_text = textwrap.fill(line, width=50)
                for wrapped_line in wrapped_text.split('\n'):
                    draw.text((20, y_position), wrapped_line, fill=self.text_color, font=font_text)
                    y_position += 30
            else:
                draw.text((20, y_position), line, fill=self.text_color, font=font_text)
                y_position += 30

        return card
