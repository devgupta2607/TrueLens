import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import pickle
import string
import os
from os import listdir
from keras.models import Model
from keras.layers import Input
from keras.layers import LSTM
from keras.layers import Dense
from keras.layers import Embedding
from keras.layers import Dropout
from keras.callbacks import ModelCheckpoint
from keras.utils import to_categorical
from keras.layers import Bidirectional
from textblob import TextBlob

import tensorflow as tf
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras.utils import plot_model
from sklearn.metrics import classification_report , confusion_matrix
from keras.models import load_model



def define_model(vocab_size=3000 , max_len=1000):

  inputs = Input(shape = (max_len,))
  se1 = Embedding(vocab_size , 256 , mask_zero = True)(inputs)
  se2 = Dropout(0.5)(se1)
  se3 = Bidirectional(LSTM(256))(se2)
  se4 = Dense(512 , activation='relu')(se3)
  se5 = Dropout(0.5)(se4)
  se6 = Dense(128 , activation='relu')(se5)
  outputs = Dense(1 , activation='sigmoid')(se6)

  #initialize the model
  model = Model(inputs=inputs , outputs = outputs)
  #compiling model
  #model.compile(loss = 'binary_crossentropy' , optimizer = 'adam')
  #printing summary of model
  #print(model.summary())
  #plot_model(model, to_file='model.png', show_shapes=True)
  return model

def clean_reviews(reviews):
    #loading puctuations
    punctuations = string.punctuation
    X = []
    for review in reviews:
      words = []
      for wrd in review.split():
        eff_wrd = (wrd.strip(punctuations)).lower()
        words.append(eff_wrd)
      new_review = ' '.join(words)
      X.append(new_review)
    return X

def make_seq(tokenizer , reviews , max_len=1000):
  X = list()
  for i in range(len(reviews)):
    in_seq = tokenizer.texts_to_sequences([reviews[i]])[0]
    in_seq = pad_sequences([in_seq], maxlen=max_len)[0]
    X.append(in_seq)
  return np.array(X)

def predict(model , tokenizer , reviews ,  max_len=1000):
  sequence = make_seq(tokenizer , reviews , max_len)
  y = model.predict(sequence)
  Y = []
  for cy in y:
    if cy <= 0.5:
      Y.append(0)
    else:
      Y.append(1)
  return Y


def Predict_ECommerce_Review(file):
  buyer_reviews = pd.read_csv(file , delimiter = ',')

  X = []
  for i in range(buyer_reviews.shape[0]):
    X.append(buyer_reviews.iloc[i]["Review_Title"] + buyer_reviews.iloc[i]["Review_Text"])

  token = pickle.load(open('tokenizer.pkl', 'rb'))
  model = define_model()
  model.load_weights('model_new_0.h5')
  clean_X = clean_reviews(X)

  Y_pred = predict(model , token , clean_X)

  Y = []
  for i in range(len(Y_pred)):
    if Y_pred[i] >= 0.5:
      #real
      Y.append("Real")
    else:
      #fake
      Y.append("Fake")

  ###prediction for sentiment
  Y_sentiment = []
  for rev in clean_X:
    blob = TextBlob(rev)
    polar = blob.sentiment.polarity
    if polar > 0.3:
      Y_sentiment.append("Positive")
    elif polar < -0.3:
      Y_sentiment.append("Negative")
    else:
      Y_sentiment.append("Neutral")
  print(Y)
  print(Y_sentiment)
  buyer_reviews["Authenticity"] = Y
  buyer_reviews["Sentiment"] = Y_sentiment

  return buyer_reviews



if __name__ == '__main__':
	None

