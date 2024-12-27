import os
import json
from flask import Flask, render_template, send_from_directory, abort, Response
from bs4 import BeautifulSoup

app = Flask(__name__)

CONFIG_FILE = os.path.join(app.root_path, 'docs_config.json')

BANNER_HTML = '''
<div style="width: 100%; text-align: center; background-color: #335afb; color: #ffffff; padding: 5px; font-weight: bold;">
    Archived documentation version for the DevNet Expert exam. Learn more at 
    <a href="https://www.devnet-academy.com" style="color: #ffffff; text-decoration: underline" target="_blank">DevNet Academy</a> |
    <a href="/" style="color: #ffffff; text-decoration: underline">Docs Home</a>
</div>
'''


def load_config():
    """
    Loads the JSON configuration file.
    """
    try:
        with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
            config = json.load(f)
        return config.get('documents', [])
    except Exception as e:
        print(f"Error loading configuration: {e}")
        return []

docs_config = load_config()

@app.route('/')
def home():
    """
    Renders the homepage with links to all available documentation sets.
    """
    return render_template('home.html', docs=docs_config)

@app.route('/docs/<doc_name>/')
@app.route('/docs/<doc_name>/<path:filename>')
def serve_docs(doc_name, filename=None):
    """
    Serves the requested documentation files based on the configuration.
    Injects the banner into HTML files.
    Disables external links by showing an alert instead of navigating.
    """
    doc = next((item for item in docs_config if item["name"].lower() == doc_name.lower()), None)
    if not doc:
        abort(404, description="Documentation set not found.")

    docs_base_path = os.path.join(app.static_folder, 'docs')
    
    if filename is None:
        filename = 'index.html'

    file_path = os.path.join(docs_base_path, doc['index_path'])
    
    if filename != 'index.html':
        index_dir = os.path.dirname(file_path)
        file_path = os.path.join(index_dir, filename)
    
    file_path = os.path.normpath(file_path)
    
    if not file_path.startswith(docs_base_path) or not os.path.exists(file_path):
        abort(404, description="File not found.")

    if not filename.endswith('.html'):
        serve_dir = os.path.dirname(file_path)
        serve_file = os.path.basename(file_path)
        return send_from_directory(serve_dir, serve_file)
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')
    except Exception as e:
        abort(500, description=f"Error reading file: {e}")

    body = soup.body
    if body:
        existing_banner = body.find('div', style=lambda value: value and 'background-color: #855832' in value)
        if not existing_banner:
            banner = BeautifulSoup(BANNER_HTML, 'html.parser')
            body.insert(0, banner)
        
        for link in soup.find_all('a', href=True):
            href = link['href']
            if href.startswith('https://www.devnet'):
                continue
            if href.startswith('http://') or href.startswith('https://'):
                link['href'] = '#'
                link['onclick'] = "alert('External links are disabled during the exam.'); return false;"

    return Response(str(soup), mimetype='text/html')

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html', error=e), 404

@app.errorhandler(500)
def internal_error(e):
    return render_template('500.html', error=e), 500

if __name__ == '__main__':
    app.run(debug=True)
