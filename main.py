from flask import Flask, render_template, Response, request
from probe import confuse, recieve
import base64

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/js/<name>')
def javascript(name):
    return confuse.confuse_js(name)

@app.route('/image/<name>', methods = ["GET", "POST"])
def js_recieve(name):
    result = request.data
    recieve.log(str(base64.b64decode(result), encoding='utf-8'))
    png = open("probe/error.png", 'rb').read()
    res = Response(png, mimetype="image/jpeg")
    return res

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='80', debug=True)