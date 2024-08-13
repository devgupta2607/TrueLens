import keras
from keras.backend.common import image_data_format
import matplotlib.pyplot as plt
import cv2
import numpy as np
from mymodel import load_pretrain_model_by_index
import urllib.request
from PIL import Image
import io
import base64

def get_mask(link):
    with urllib.request.urlopen(link) as url:
        img = url.read()
        a = np.frombuffer(img , dtype = np.uint8)
        img = cv2.imdecode(a , flags = 1)
        #cv2.imwrite('curr_img.png' , img)
        model = load_pretrain_model_by_index(4 , 'pretrained_weights')
        #img_rgb = cv2.cvtColor(img , cv2.COLOR_BGR2RGB)
        img_input = np.reshape(img , [1 , img.shape[0] , img.shape[1] , 3])
        out = model.predict(img_input)
        mask = np.reshape(out , [out.shape[1] , out.shape[2]])
        #cv2.imwrite('mask.png' , mask)
        plt.imsave('mask.png', mask, cmap='gray')
        with open("mask.png", "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read())
            return encoded_string

#get_mask('https://www.freepnglogos.com/uploads/youtube-logo-transparent-10.png')