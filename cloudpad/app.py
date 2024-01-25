import os
import random
import string
from flask import Flask, render_template, request, session, redirect, send_from_directory, jsonify
import hashlib
import time
import re
import json
from html import escape


flask_route = os.environ.get('FLASK_ROUTE', '/')

app = Flask(__name__)

@app.route(flask_route)
def index():
    return create_page()

@app.route(flask_route + 'static/<path:filename>')
def custom_static(filename):
    return send_from_directory('./static', filename)

@app.route(flask_route + 'create_page', methods=['GET'])
def create_page():
    domain = request.host
    endpoint = ''.join(random.choices(string.ascii_lowercase, k=3)) + '-' + str(random.randint(10000, 99999))
    endpoint_path = os.path.join(app.root_path, "static/users/" + endpoint)
    notes = []
    with open(endpoint_path, 'w') as file:
        file.write(json.dumps(notes))
    return redirect(flask_route + endpoint)

@app.route(flask_route + '<endpoint>', methods=['GET'])
def show_page(endpoint):
    endpoint_path = os.path.join(app.root_path,  "static/users/" + endpoint)
    print(endpoint_path)
    if os.path.exists(endpoint_path):
        template_path = os.path.join(app.root_path, './static/template.html')
        with open(template_path, 'r') as file:
            html = file.read()
            html = html.replace('<div id="link-container"></div>', '<div id="link-container">{0}{1}{2}</div>'.format(request.host, flask_route, endpoint))
            html = html.replace("{{ url_for('static', filename='style.css') }}", flask_route + 'static/style.css')
            with open(endpoint_path, 'r') as data_file:
                mydatarecords = json.load(data_file)
                html = html.replace('<div id="hidden-div" style="display: none;"></div>', '<div id="hidden-div" style="display: none;">{}</div>'.format(escape(json.dumps(mydatarecords))))

            return html
    else:
        return "Endpoint not found"



@app.route(flask_route + 'save_to_cloud', methods=['POST'])
def save_to_cloud():
    notes = request.get_json()
    endpoint = os.path.join(app.root_path, "static/users/" + notes['endpoint'])
    with open(endpoint, 'w') as file:
        file.write(json.dumps(notes))
    return '', 200

if __name__ == '__main__':
    app.run(debug=True)
