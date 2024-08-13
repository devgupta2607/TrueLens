
from bs4 import BeautifulSoup as bs
import requests
import pandas as pd
from selenium import webdriver
import re
import time
from predict import Predict_ECommerce_Review

def valid_bajaao_url(link):
    regex = re.compile(r"^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?bajaao+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$")
    
    return regex.search(link)

#link = 'https://www.bajaao.com/products/stagg-sensa-ocean-16-inches-extra-thin-crash?variant=362377740312'

#link = input("Enter Link : ")

def create_output(link):
    if (link != None and valid_bajaao_url(link)):
        
        options = webdriver.ChromeOptions()
        options.headless = True
        #options.add_argument('--user-agent="Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 640 XL LTE) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Mobile Safari/537.36 Edge/12.10166"')
        prefs = {"profile.default_content_setting_values.notifications":2}
        options.add_experimental_option("prefs",prefs)

        driver = webdriver.Chrome('chromedriver.exe',options=options)
        driver.maximize_window()
        time.sleep(5)

        driver.get(link) 
        time.sleep(3)
        #[item.click() for item in driver.find_elements_by_class_name("_1BWGvX")]
        #time.sleep(1)
        #page = requests.get(driver.current_url)

        #print(page.content)

        soup = bs(driver.page_source,'html.parser')
        #print(soup.prettify())
        df = pd.DataFrame(columns=['Review_Title','Review_Text', 'Product_Title','Img_url'])
        img_elem = soup.find('figure',{"class":"mz-figure mz-hover-zoom mz-ready"}).find('img')
        #print(type(img_elem))
        img_url = img_elem.get("src")
        #print(img_url)
        product_title = img_elem.get("alt")
        #print(product_title)
        review_cards = soup.find_all('div',{"class":"jdgm-rev jdgm-divider-top jdgm--leex-done-setup jdgm--done-setup"})
        #total_cards = len(review_cards)
        for card in review_cards:
            #cust_name = card.find('p',{"class":"_3LYOAd _3sxSiS"})
            review_title = card.find('div',{"class":"jdgm-rev__content"}).find('b',{"class":"jdgm-rev__title"})
            if (review_title != None):
                review_title = review_title.text
            else:
                review_title = ''
            review_body = card.find('div',{"class":"jdgm-rev__content"}).find("div",{"class":"jdgm-rev__body"}).find("p")
            if (review_body != None):
                review_body = review_body.text
                #review_body = review_body.lstrip('\n').rstrip('\n')
            else:
                review_body = ''
            
            if (review_title != '' and review_body != ''):
                df = df.append({
                                'Review_Title':review_title,
                                'Review_Text':review_body,
                                'Product_Title':product_title,
                                'Img_url': img_url
                            },ignore_index=True)
        df.to_csv('reviews.csv',index=True)
        driver.quit()
        df = Predict_ECommerce_Review("reviews.csv")
        df.to_csv('reviews.csv',index=True)
        df = pd.read_csv("reviews.csv")
        
        result = [{
                    'review_title':row['Review_Title'],
                    'review_body':row['Review_Text'],
                    'product_title': row['Product_Title'],
                    'img_url': row['Img_url'],
                    'sentiment':row['Sentiment'],
                    'authenticity':row['Authenticity']
                } for _, row in df.iterrows()]
        """
        
        result = [{
                    'review_title':row['Review_Title'],
                    'review_body':row['Review_Text'],
                    'product_title': row['Product_Title'],
                    'img_url': row['Img_url']
                } for _, row in df.iterrows()] """
        return result

    else:
        print("Either blank or wrong url")

#print(create_output(link))