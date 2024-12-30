import os
import json
import logging
from flask import Flask, render_template, send_from_directory, abort, Response, url_for, redirect
from bs4 import BeautifulSoup

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)

CONFIG_FILE = os.path.join(app.root_path, 'docs_config.json')

BANNER_HTML = '''
<div style="width: 100%; text-align: center; background-color: #335afb; color: #ffffff; padding: 5px; font-weight: bold;">
    Archived documentation version for the DevNet Expert exam. Learn more at
    <a href="https://www.devnet-academy.com" style="color: #ffffff; text-decoration: underline" target="_blank">DevNet Academy</a> |
    <a href="/" style="color: #ffffff; text-decoration: underline">Docs Home</a>
</div>
'''

COLUMN_ASSIGNMENTS = {
    "column1": ["python_libraries"],
    "column2": ["3rd_party_software", "terraform_aci"],
    "column3": ["standards_and_specification", "cisco_docs"]
}
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


def inject_banner_and_fix_links(soup, route_prefix=None, doc_name=None):
    """
    Injects the exam banner and fixes both external links and internal references.

    :param soup: A BeautifulSoup object representing the parsed HTML.
    :param route_prefix: URL prefix to fix absolute paths (e.g. "/docs/vault_v1.8.x/").
    :param doc_name: The documentation name, if needed for building url_for.
    :return: Modified BeautifulSoup object.
    """
    body = soup.body
    if not body:
        return soup

    # Inject banner if not already present
    existing_banner = body.find('div', style=lambda v: v and 'background-color: #335afb' in v)
    if not existing_banner:
        banner = BeautifulSoup(BANNER_HTML, 'html.parser')
        body.insert(0, banner)
        logging.debug("Inserted banner into HTML.")

    # Disable external links & fix internal absolute paths
    for link in soup.find_all('a', href=True):
        href = link['href']
        if href.startswith('https://www.devnet-academy.com'):
            continue
        if href.startswith('http://') or href.startswith('https://'):
            link['href'] = '#'
            link['onclick'] = "alert('External links are disabled during the exam.'); return false;"
            logging.debug(f"Disabled external link: {href}")
        elif href.startswith('/') and route_prefix:
            relative_path = href.lstrip('/')
            if doc_name:
                link['href'] = url_for('serve_docs', doc_name=doc_name, filename=relative_path)
            else:
                link['href'] = os.path.join(route_prefix, relative_path)
            logging.debug(f"Fixed internal link: {href} -> {link['href']}")

    for tag in soup.find_all(['link', 'script', 'img']):
        if tag.name == 'link' and tag.has_attr('href'):
            href = tag['href']
            if href.startswith('/') and route_prefix:
                relative_path = href.lstrip('/')
                if doc_name:
                    tag['href'] = url_for('serve_docs', doc_name=doc_name, filename=relative_path)
                else:
                    tag['href'] = os.path.join(route_prefix, relative_path)
                logging.debug(f"Fixed CSS link: {href} -> {tag['href']}")

        if tag.name in ['script', 'img'] and tag.has_attr('src'):
            src = tag['src']
            if src.startswith('/') and route_prefix:
                relative_path = src.lstrip('/')
                if doc_name:
                    tag['src'] = url_for('serve_docs', doc_name=doc_name, filename=relative_path)
                else:
                    tag['src'] = os.path.join(route_prefix, relative_path)
                logging.debug(f"Fixed JS/img source: {src} -> {tag['src']}")

    return soup


def serve_html_file(file_path, route_prefix=None, doc_name=None):
    """
    Reads and parses an HTML file, then calls inject_banner_and_fix_links().
    Returns a Flask Response with the modified HTML.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')
        logging.debug(f"Opened HTML file: {file_path}")
    except Exception as e:
        logging.error(f"Error reading file '{file_path}': {e}")
        abort(500, description=f"Error reading file: {e}")

    soup = inject_banner_and_fix_links(soup, route_prefix=route_prefix, doc_name=doc_name)
    return Response(str(soup), mimetype='text/html')


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
    Serves the Vault documentation by injecting the banner and rewriting links.
    """
    vault_dir = os.path.join(app.static_folder, 'docs', 'vault_v1.8.x')

    full_path = os.path.join(vault_dir, path)
    if os.path.isdir(full_path):
        full_path = os.path.join(full_path, 'index.html')

    if not os.path.exists(full_path):
        logging.warning(f"File '{path}' not found in Vault documentation.")
        abort(404, description="File not found.")

    if not full_path.endswith('.html'):
        return send_from_directory(os.path.dirname(full_path), os.path.basename(full_path))

    return serve_html_file(full_path, route_prefix='/docs/vault_v1.8.x/')


@app.route('/docs/<doc_name>/', defaults={'filename': 'index.html'})
@app.route('/docs/<doc_name>/<path:filename>')
def serve_docs(doc_name, filename):
    """
    Serves documentation files based on the configuration, injecting the banner and rewriting links.
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

    if 'vault' in doc_name.lower():
        return redirect('/docs/vault_v1.8.x/docs')

    docs_base_path = os.path.join(app.static_folder, 'docs')
    index_dir = os.path.dirname(doc['index_path'])

    file_path = os.path.join(docs_base_path, index_dir, filename)
    file_path = os.path.normpath(file_path)

    if not file_path.startswith(os.path.normpath(docs_base_path)):
        logging.warning(f"Attempted to access file outside allowed docs path: {file_path}")
        abort(404, description="File not found.")

    if os.path.isdir(file_path):
        file_path = os.path.join(file_path, 'index.html')

    if not os.path.exists(file_path):
        logging.warning(f"File '{file_path}' not found.")
        abort(404, description="File not found.")

    if not file_path.endswith('.html'):
        return send_from_directory(os.path.dirname(file_path), os.path.basename(file_path))

    return serve_html_file(file_path, doc_name=doc_name, route_prefix=f'/docs/{doc_name}/')


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
