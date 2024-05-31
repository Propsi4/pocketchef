import requests
from bs4 import BeautifulSoup
import json


class ImageURLSearch:
    @staticmethod
    def get_valid_image_url(item_name: str) -> str:
        '''
        Get a valid image URL for the item

        Args:
            item_name (str): The name of the item to search for

        Returns:
            str: The valid image URL
            '''
        urls = ImageURLSearch.get_image_urls(item_name)
        valid_url = ImageURLSearch.validate_url(urls)

        return valid_url

    @staticmethod
    def validate_url(urls: list, return_first=True) -> list:
        '''
        Validate the URLs

        Args:
            urls (list): A list of URLs to validate
            return_first (bool): Whether to return the first valid URL or all valid URLs

        Returns:
            return_first == True: list: A list of valid URLs
            return_first == False: str: The first valid URL
        '''
        valid_urls = []
        for url in urls:
            try:
                response = requests.get(url)
                response.raise_for_status()
                if return_first:
                    return url
                else:
                    valid_urls.append(url)
            except requests.exceptions.RequestException:
                pass

        if return_first:
            return None
        else:
            return valid_urls

    @staticmethod
    def get_image_urls(item_name: str) -> str:
        '''
        Get a list of image URLs for the item

        Args:
            item_name (str): The name of the item to search for

        Returns:
            str: The list of image URLs
        '''
        search_url = f"https://www.bing.com/images/search?q={item_name}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        }

        response = requests.get(search_url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')
        a_tags = soup.find_all("a")
        filtered_a_tags = [a_tag.get('m') for a_tag in a_tags if a_tag.has_attr('m')]
        parsed_urls = [json.loads(tag).get('murl') for tag in filtered_a_tags if '"murl"' in tag]

        return parsed_urls
