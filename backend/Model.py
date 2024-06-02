from ultralytics import YOLO
import io
from fastapi import UploadFile
from PIL import Image, UnidentifiedImageError
from load_config import (CHECKPOINT_PATH, CLASSES,
                         SAVE_INFERENCE_PATH, VERBOSE,
                         SAVE_INFERENCE)


class Model:
    '''
    A class to predict the class of an image

    Attributes:
        checkpoint_path (str): The path to the checkpoint file
        verbose (bool): Whether to print the prediction details
        save_image (bool): Whether to save the image with the prediction
        model (YOLO): The YOLO model

    Methods:
        predict(image_path): Predict the class of an image
            '''
    def __init__(self, checkpoint_path=CHECKPOINT_PATH,
                 verbose=VERBOSE, save_image=SAVE_INFERENCE):
        self.verbose = verbose
        self.save_image = save_image
        self.model = YOLO(checkpoint_path)

    def load_image(self, image: Image) -> Image:
        '''
        Load the image

        Args:
            image (UploadFile): The image to load

        Returns:
            Image: The loaded image
        '''
        try:
            image_data = image.file.read()
            return Image.open(io.BytesIO(image_data)).convert('RGB')
        except UnidentifiedImageError:
            return None

    def predict(self, image_path: UploadFile) -> list:
        '''
        Predict the class of an image

        Args:
            image_path (str): The path to the image

        Returns:
            list: The list of classes in the image
        '''
        image = self.load_image(image_path)
        if image is None:
            return []
        prediction = self.model(image,
                                verbose=self.verbose,
                                save=self.save_image,
                                project=SAVE_INFERENCE_PATH,
                                exist_ok=True)

        class_ids = prediction[0].boxes.cls.data.cpu()
        class_names = [CLASSES[int(i)] for i in class_ids]
        # class_amount = {class_name: class_names.count(class_name) for class_name in class_names}
        available_classes = list(set(class_names))

        return available_classes
