import yaml


def load_config():
    with open('config.yaml', 'r') as file:
        config = yaml.load(file, Loader=yaml.FullLoader)
    return config


config = load_config()
CHECKPOINT_PATH = config['CHECKPOINT_PATH']
CLASSES = config['NAMES']
SAVE_INFERENCE_PATH = config['SAVE_INFERENCE_PATH']
VERBOSE = config['VERBOSE']
SAVE_INFERENCE = config['SAVE_INFERENCE']
