import os
import json
import logging
from flask import Flask, render_template, send_from_directory, abort, Response, url_for, redirect
from bs4 import BeautifulSoup

app = Flask(__name__)

# Configure logging for debugging
logging.basicConfig(level=logging.DEBUG)

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
        logging.error(f"Error loading configuration: {e}")
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
    Renders the homepage with links to all available documentations.
    """
    return render_template('home.html', grouped_docs=grouped_docs)

@app.route('/docs/vault_v1.8.x/', defaults={'path': 'index.html'})
@app.route('/docs/vault_v1.8.x/<path:path>')
def serve_vault(path):
    """
    Serves the Vault documentation without modifying the HTML files.
    """
    # Define the path to the exported Vault static files
    vault_dir = os.path.join(app.static_folder, 'docs', 'vault_v1.8.x')  # Adjust if necessary

    # If the path is a directory, append 'index.html'
    if os.path.isdir(os.path.join(vault_dir, path)):
        path = os.path.join(path, 'index.html')

    if not path.endswith('.html'):
        # Serve non-HTML files directly
        serve_dir = vault_dir
        serve_file = path
        if os.path.exists(os.path.join(serve_dir, serve_file)):
            return send_from_directory(serve_dir, serve_file)
        else:
            logging.warning(f"File '{serve_file}' not found in Vault documentation.")
            abort(404, description="File not found.")

    try:
        with open(os.path.join(vault_dir, path), 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')
        logging.debug(f"Opened Vault HTML file: {path}")
    except Exception as e:
        logging.error(f"Error reading Vault file '{path}': {e}")
        abort(500, description=f"Error reading file: {e}")

    body = soup.body
    if body:
        # Inject the banner
        existing_banner = body.find('div', style=lambda value: value and 'background-color: #335afb' in value)
        if not existing_banner:
            banner = BeautifulSoup(BANNER_HTML, 'html.parser')
            body.insert(0, banner)
            logging.debug("Inserted banner into Vault HTML.")

        # Disable external links except specified ones
        for link in soup.find_all('a', href=True):
            href = link['href']
            if href.startswith('https://www.devnet-academy.com'):
                continue
            if href.startswith('http://') or href.startswith('https://'):
                link['href'] = '#'
                link['onclick'] = "alert('External links are disabled during the exam.'); return false;"
                logging.debug(f"Disabled external link in Vault: {href}")
            elif href.startswith('/'):
                # Fix internal absolute paths by prepending the documentation route
                relative_path = href.lstrip('/')
                # Since we're in the Vault route, adjust the URL accordingly
                link['href'] = f"/docs/vault_v1.8.x/{relative_path}"
                logging.debug(f"Fixed internal link in Vault: {href} -> {link['href']}")

        # Fix 'link' tags for CSS and 'script' tags for JS
        for tag in soup.find_all(['link', 'script', 'img']):
            if tag.name == 'link' and tag.has_attr('href'):
                href = tag['href']
                if href.startswith('/'):
                    relative_path = href.lstrip('/')
                    tag['href'] = f"/docs/vault_v1.8.x/{relative_path}"
                    logging.debug(f"Fixed CSS link in Vault: {href} -> {tag['href']}")
            if tag.name in ['script', 'img'] and tag.has_attr('src'):
                src = tag['src']
                if src.startswith('/'):
                    relative_path = src.lstrip('/')
                    tag['src'] = f"/docs/vault_v1.8.x/{relative_path}"
                    logging.debug(f"Fixed JS/img source in Vault: {src} -> {tag['src']}")

    return Response(str(soup), mimetype='text/html')

@app.route('/docs/<doc_name>/')
@app.route('/docs/<doc_name>/<path:filename>')
def serve_docs(doc_name, filename=None):
    """
    Serves the requested documentation files based on the configuration
    and injects the banner into HTML files.
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
        logging.warning(f"Documentation set '{doc_name}' not found.")
        abort(404, description="Documentation set not found.")

    # If the documentation set is Vault, redirect to the separate Vault route
    if 'vault' in doc_name.lower():
        return redirect('/docs/vault_v1.8.x/docs')

    docs_base_path = os.path.join(app.static_folder, 'docs')

    if filename is None or filename == 'index.html':
        file_path = os.path.join(docs_base_path, doc['index_path'])
        logging.debug(f"Serving main index.html for '{doc_name}': {file_path}")
    else:
        index_dir = os.path.dirname(doc['index_path'])
        file_path = os.path.join(docs_base_path, index_dir, filename)

        logging.debug(f"Serving documentation for: {doc_name}")
        logging.debug(f"Requested file: {filename}")
        logging.debug(f"Resolved file path: {file_path}")

        file_path = os.path.normpath(file_path)

        if not file_path.startswith(os.path.normpath(docs_base_path)) or not os.path.exists(file_path):
            logging.warning(f"File path '{file_path}' is invalid or does not exist.")
            abort(404, description="File not found.")

        if os.path.isdir(file_path):
            file_path = os.path.join(file_path, 'index.html')
            logging.debug(f"Requested path is a directory. Serving index.html: {file_path}")

            if not os.path.exists(file_path):
                logging.warning(f"Index file '{file_path}' not found in the directory.")
                abort(404, description="File not found.")

        is_html = file_path.endswith('.html')

        if not is_html:
            logging.debug(f"Serving non-HTML file: {file_path}")
            serve_dir = os.path.dirname(file_path)
            serve_file = os.path.basename(file_path)
            return send_from_directory(serve_dir, serve_file)
    
    if not file_path.endswith('.html'):
        serve_dir = os.path.dirname(file_path)
        serve_file = os.path.basename(file_path)
        if os.path.exists(file_path):
            logging.debug(f"Serving non-HTML file as fallback: {file_path}")
            return send_from_directory(serve_dir, serve_file)
        else:
            logging.warning(f"File '{file_path}' not found.")
            abort(404, description="File not found.")

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')
        logging.debug(f"Opened HTML file: {file_path}")
    except Exception as e:
        logging.error(f"Error reading file '{file_path}': {e}")
        abort(500, description=f"Error reading file: {e}")

    body = soup.body
    if body:
        existing_banner = body.find('div', style=lambda value: value and 'background-color: #335afb' in value)
        if not existing_banner:
            banner = BeautifulSoup(BANNER_HTML, 'html.parser')
            body.insert(0, banner)
            logging.debug("Inserted banner into HTML.")

        for link in soup.find_all('a', href=True):
            href = link['href']
            if href.startswith('https://www.devnet-academy.com'):
                continue
            if href.startswith('http://') or href.startswith('https://'):
                link['href'] = '#'
                link['onclick'] = "alert('External links are disabled during the exam.'); return false;"
                logging.debug(f"Disabled external link: {href}")
            elif href.startswith('/'):
                # Fix internal absolute paths by prepending the documentation route
                relative_path = href.lstrip('/')
                link['href'] = url_for('serve_docs', doc_name=doc['name'], filename=relative_path)
                logging.debug(f"Fixed internal link: {href} -> {link['href']}")

        # Fix 'link' tags for CSS and 'script' tags for JS
        for tag in soup.find_all(['link', 'script', 'img']):
            if tag.name == 'link' and tag.has_attr('href'):
                href = tag['href']
                if href.startswith('/'):
                    relative_path = href.lstrip('/')
                    tag['href'] = url_for('serve_docs', doc_name=doc['name'], filename=relative_path)
                    logging.debug(f"Fixed CSS link: {href} -> {tag['href']}")
            if tag.name in ['script', 'img'] and tag.has_attr('src'):
                src = tag['src']
                if src.startswith('/'):
                    relative_path = src.lstrip('/')
                    tag['src'] = url_for('serve_docs', doc_name=doc['name'], filename=relative_path)
                    logging.debug(f"Fixed JS/img source: {src} -> {tag['src']}")

    return Response(str(soup), mimetype='text/html')

@app.errorhandler(404)
def page_not_found(e):
    logging.warning(f"404 Error: {e}")
    return render_template('404.html', error=e), 404

@app.errorhandler(500)
def internal_error(e):
    logging.error(f"500 Error: {e}")
    return render_template('500.html', error=e), 500

if __name__ == '__main__':
    app.run(debug=True)
