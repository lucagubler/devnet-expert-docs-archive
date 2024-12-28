import os
import json
from flask import Flask, render_template, send_from_directory, abort, Response, url_for
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
        return config
    except Exception as e:
        print(f"Error loading configuration: {e}")
        return {}

COLUMN_ASSIGNMENTS = {
    "column1": ["python_libraries"],
    "column2": ["3rd_party_software", "terraform_aci"],
    "column3": ["standards_and_specification", "cisco_docs"]
}

docs_config = load_config()

grouped_docs = {}
for column, categories in COLUMN_ASSIGNMENTS.items():
    grouped_docs[column] = {
        "title": "",
        "categories": []
    }
    for category_key in categories:
        category = docs_config.get(category_key)
        if category:
            grouped_docs[column]["title"] = category.get("title", "")
            grouped_docs[column]["categories"].append(category)

@app.route('/')
def home():
    """
    Renders the homepage with links to all available documentation sets.
    """
    return render_template('home.html', grouped_docs=grouped_docs)

@app.route('/docs/<doc_name>/')
@app.route('/docs/<doc_name>/<path:filename>')
def serve_docs(doc_name, filename=None):
    """
    Serves the requested documentation files based on the configuration
    and disables external links.
    """
    doc = None
    for category in docs_config.values():
        for item in category.get("docs", []):
            if item["name"].lower() == doc_name.lower():
                doc = item
                break
        if doc:
            break

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
        existing_banner = body.find('div', style=lambda value: value and 'background-color: #335afb' in value)
        if not existing_banner:
            banner = BeautifulSoup(BANNER_HTML, 'html.parser')
            body.insert(0, banner)

        # Disable external links
        for link in soup.find_all('a', href=True):
            href = link['href']
            if href.startswith('https://www.devnet-academy.com'):
                continue
            if href.startswith('http://') or href.startswith('https://'):
                link['href'] = '#'
                link['onclick'] = "alert('External links are disabled during the exam.'); return false;"
            elif href.startswith('/'):
                relative_path = href.lstrip('/')
                link['href'] = url_for('serve_docs', doc_name=doc['name'], filename=relative_path)

        # Fix 'link' tags for CSS and 'script' tags for JS
        for tag in soup.find_all(['link', 'script', 'img']):
            if tag.name == 'link' and tag.has_attr('href'):
                href = tag['href']
                if href.startswith('/'):
                    relative_path = href.lstrip('/')
                    tag['href'] = url_for('serve_docs', doc_name=doc['name'], filename=relative_path)
            if tag.name in ['script', 'img'] and tag.has_attr('src'):
                src = tag['src']
                if src.startswith('/'):
                    relative_path = src.lstrip('/')
                    tag['src'] = url_for('serve_docs', doc_name=doc['name'], filename=relative_path)

    return Response(str(soup), mimetype='text/html')

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html', error=e), 404

@app.errorhandler(500)
def internal_error(e):
    return render_template('500.html', error=e), 500

if __name__ == '__main__':
    app.run(debug=True)
