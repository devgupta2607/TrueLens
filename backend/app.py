from news import get_news
from flask import Flask, jsonify , request
from flask_cors import CORS
import requests
from image import get_mask
from product_reviews import create_output

app = Flask(__name__)
CORS(app)

@app.route('/api/news/<string:query>/<int:offset>', methods=['GET'])
def news(query, offset):
  return jsonify(get_news(q=query, offset=offset))

@app.route('/api/news/top', methods=['GET'])
def top():
  url = "https://trends.google.com/trends/hottrends/visualize/internal/data"
  headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36'}
  response = requests.get(url, headers=headers, timeout=20)
  return jsonify(response.content.decode('utf8'))

@app.route('/')
def home():
  return 'News Reporter'

@app.route('/api/image' , methods = ['GET'])
def image():
  query = request.args.get('query')
  print(query)
  v = str(get_mask(query))
  v = v[2:-1]
  return jsonify({'a': v})

@app.route('/api/ecomm', methods=['GET'])
def ecomm():
  data_url = request.args.get('query')
  print(data_url)
  result_out = create_output(data_url)
  print(result_out)
  #result_out = enumerate(result_out)
  
  return jsonify({'ecomm_reviews': result_out})