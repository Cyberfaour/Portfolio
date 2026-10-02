#!/usr/bin/env python3
"""Check the static portfolio's local navigation and essential HTML semantics.

Uses only Python's standard library. It does not submit forms or contact services.
"""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
PAGES = ('index.html', 'Gridlock Case Study.html', 'Telemetry Case Study.html',
         'ADNOC Case Study.html', 'DoE LPG Case Study.html', 'AI Workflow Case Study.html')
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
        'meta', 'param', 'source', 'track', 'wbr'}
ERRORS = []


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.elements = []
        self.stack = []
        self.ids = []
        self.refs = []
        self.feed(path.read_text(encoding='utf-8'))
        self.close()
        if self.stack:
            ERRORS.append(f'{path.name}: unclosed tags {self.stack}')

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.elements.append((tag, attrs))
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        for name in ('href', 'src'):
            if name in attrs:
                self.refs.append(attrs[name])
        if tag not in VOID:
            self.stack.append(tag)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.stack.pop()

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack or self.stack[-1] != tag:
            ERRORS.append(f'{self.path.name}: unexpected closing tag {tag}')
            if tag in self.stack:
                self.stack.remove(tag)
            return
        self.stack.pop()

    def select(self, tag=None, attr=None):
        return [(t, a) for t, a in self.elements
                if (tag is None or t == tag) and (attr is None or attr in a)]


def check(condition, message):
    if not condition:
        ERRORS.append(message)


parsed = {path.name: Page(path) for path in ROOT.glob('*.html')}
local_refs = 0
for name, doc in parsed.items():
    duplicates = [value for value, count in Counter(doc.ids).items() if count > 1]
    check(not duplicates, f'{name}: duplicate IDs {duplicates}')
    check(len(doc.select('h1')) == 1, f'{name}: expected one H1')
    check(any(t == 'html' and a.get('lang') == 'en' for t, a in doc.elements),
          f'{name}: missing document language')
    for _, attrs in doc.elements:
        for relation in ('aria-labelledby', 'aria-describedby', 'aria-controls'):
            for target in (attrs.get(relation) or '').split():
                check(target in doc.ids, f'{name}: {relation} references missing {target}')
    for ref in doc.refs:
        parts = urlsplit(ref)
        if parts.scheme or parts.netloc:
            continue
        local_refs += 1
        target = (doc.path.parent / unquote(parts.path)).resolve() if parts.path else doc.path
        if target.is_dir():
            target = target / 'index.html'
        check(target.exists(), f'{name}: missing local destination {ref}')
        if target.exists() and target.suffix == '.html' and parts.fragment:
            linked = parsed.get(target.name) if target.parent == ROOT else None
            if linked is None:
                linked = Page(target)
            check(unquote(parts.fragment) in linked.ids,
                  f'{name}: missing fragment {ref}')

for name in PAGES:
    doc = parsed.get(name)
    check(doc is not None, f'Missing primary page {name}')
    if doc is None:
        continue
    source = doc.path.read_text(encoding='utf-8')
    check(not re.search(r'<(?:x-dc|helmet)\b|(?:support|theme)\.js', source, re.I),
          f'{name}: legacy rendering runtime still referenced')
    check(len(doc.select(attr='data-theme-toggle')) == 1, f'{name}: expected one theme control')
    check(len(doc.select(attr='data-menu-toggle')) == 1, f'{name}: expected one menu control')
    check(len(doc.select('main')) == 1, f'{name}: expected one main landmark')
    check(any(a.get('href') == '#main' for _, a in doc.select('a')), f'{name}: missing skip link')
    check(any(a.get('src') == 'assets/scripts/portfolio.js' and 'defer' in a for _, a in doc.select('script')),
          f'{name}: missing deferred shared behavior')
    check(not any(urlsplit(a.get('src', '')).scheme for _, a in doc.select('script')),
          f'{name}: external JavaScript dependency')
    for _, img in doc.select('img'):
        check(bool(img.get('alt')), f'{name}: image missing descriptive alt')
        check(bool(img.get('width')) and bool(img.get('height')), f'{name}: image dimensions not reserved')
    for _, anchor in doc.select('a'):
        if anchor.get('target') == '_blank':
            check('noopener' in anchor.get('rel', '').split(), f'{name}: new-tab link lacks noopener')

home = parsed['index.html']
forms = home.select('form')
check(len(forms) == 1, 'Homepage: expected one contact form')
if forms:
    attrs = forms[0][1]
    check(attrs.get('action') == 'https://formspree.io/f/moqzooaa', 'Contact endpoint changed')
    check(attrs.get('method', '').upper() == 'POST', 'Contact form must POST')
    check('novalidate' not in attrs, 'Native validation unexpectedly disabled')
for field in ('name', 'email', 'message'):
    matches = [a for t, a in home.elements if t in ('input', 'textarea') and a.get('name') == field]
    check(len(matches) == 1 and 'required' in matches[0], f'Contact {field}: native required constraint missing')
email = [a for _, a in home.select('input') if a.get('name') == 'email']
check(bool(email) and email[0].get('type') == 'email', 'Contact email lacks email type')

for name, anchors in {
    'index.html': ('top', 'projects', 'ai-workflow', 'about', 'expertise', 'experience', 'credentials', 'contact'),
    'Gridlock Case Study.html': ('top', 'thesis', 'engines', 'architecture', 'discipline'),
    'ADNOC Case Study.html': ('top', 'problem', 'system', 'pipeline', 'results'),
    'DoE LPG Case Study.html': ('top', 'layers', 'pipeline', 'integrity', 'lessons'),
    'AI Workflow Case Study.html': ('top', 'context', 'workflow', 'daily', 'throughput')
}.items():
    for anchor in anchors:
        check(anchor in parsed[name].ids, f'{name}: original anchor {anchor} missing')

legacy = {
    'Ali Faour Portfolio.html': 'index.html',
    'Ali Faour Portfolio.dc.html': 'index.html',
    'index.dc.html': 'index.html',
    'Gridlock Case Study.dc.html': 'Gridlock Case Study.html',
    'ADNOC Case Study.dc.html': 'ADNOC Case Study.html',
    'DoE LPG Case Study.dc.html': 'DoE LPG Case Study.html',
}
for name, target in legacy.items():
    doc = parsed.get(name)
    check(doc is not None, f'Missing legacy redirect {name}')
    if doc:
        check(any(unquote(a.get('data-redirect', '')) == target for _, a in doc.select('body')),
              f'{name}: incorrect redirect destination')
        check(any(a.get('http-equiv', '').lower() == 'refresh' for _, a in doc.select('meta')),
              f'{name}: no no-JS redirect fallback')

css = (ROOT / 'assets/styles/portfolio.css').read_text()
check(':focus-visible' in css, 'Shared stylesheet: missing visible focus')
check('prefers-reduced-motion' in css, 'Shared stylesheet: missing reduced-motion treatment')
check('[data-theme="light"]' in css, 'Shared stylesheet: missing light-theme tokens')
check((ROOT / '.nojekyll').exists(), 'Missing .nojekyll for static hosting')

if ERRORS:
    print('\n'.join(f'FAIL: {error}' for error in ERRORS))
    sys.exit(1)
print(f'PASS: {len(PAGES)} main pages, {len(legacy)} compatibility pages, and {local_refs} local references checked.')
print('PASS: native form constraints, landmarks, original anchors, shared assets, image dimensions, and redirect fallbacks.')
print('No forms submitted and no network requests made. Browser behavior and email delivery require separate checks.')
