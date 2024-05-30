from ultralytics import YOLO
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

    def predict(self, image_path):
        '''
        Predict the class of an image

        Args:
            image_path (str): The path to the image

        Returns:
            dict: A dictionary containing the class names and the amount of each class in the image
        '''
        prediction = self.model(image_path,
                                verbose=self.verbose,
                                save=self.save_image,
                                project=SAVE_INFERENCE_PATH,
                                exist_ok=True)

        class_ids = prediction[0].boxes.cls.data.cpu()
        class_names = [CLASSES[int(i)] for i in class_ids]
        class_amount = {class_name: class_names.count(class_name) for class_name in class_names}

        return class_amount
