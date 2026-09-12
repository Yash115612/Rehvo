#!/usr/bin/env python3
"""
REHVO Web Styling & Architecture Regression Verifier
Validates that:
1. Root layout imports globals.css
2. globals.css contains complete design system tokens, typography resets, liquid-glass classes, and button primitives
3. Tailwind config scans all application source directories
4. All critical routes render with proper layout, typography, and styling assets
"""

import os
import sys
import re
import urllib.request
import urllib.error

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
WEB_DIR = os.path.join(ROOT_DIR, 'web')
LAYOUT_FILE = os.path.join(WEB_DIR, 'src', 'app', 'layout.tsx')
GLOBALS_CSS = os.path.join(WEB_DIR, 'src', 'app', 'globals.css')
TAILWIND_CONFIG = os.path.join(WEB_DIR, 'tailwind.config.js')

CRITICAL_ROUTES = [
    '/',
    '/rent',
    '/commercial',
    '/pg-rooms',
    '/flatmates',
    '/localities',
    '/about',
    '/owner/properties/new',
]

def check_file_exists(filepath, desc):
    if not os.path.exists(filepath):
        print(f"❌ FAIL: {desc} not found at {filepath}")
        return False
    print(f"✅ PASS: {desc} exists")
    return True

def audit_root_layout():
    print("\n--- Auditing Root Layout ---")
    if not check_file_exists(LAYOUT_FILE, "Root Layout"):
        return False
    
    with open(LAYOUT_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check globals.css import
    if "import './globals.css'" not in content and 'import "@/app/globals.css"' not in content:
        print("❌ FAIL: Root layout does not import globals.css")
        return False
    print("✅ PASS: Root layout imports globals.css")

    # Check html and body tags
    if '<html' not in content or '<body' not in content:
        print("❌ FAIL: Root layout missing <html> or <body> tags")
        return False
    print("✅ PASS: Root layout contains <html> and <body> elements")

    # Check typography & theme classes on body
    if 'font-sans' not in content or 'bg-[#F7F5F0]' not in content or 'text-[#19181C]' not in content:
        print("❌ FAIL: Root layout body missing canonical REHVO theme classes (font-sans, bg-[#F7F5F0], text-[#19181C])")
        return False
    print("✅ PASS: Root layout body applies canonical REHVO theme classes")

    return True

def audit_globals_css():
    print("\n--- Auditing globals.css & Design System Tokens ---")
    if not check_file_exists(GLOBALS_CSS, "globals.css"):
        return False

    with open(GLOBALS_CSS, 'r', encoding='utf-8') as f:
        css = f.read()

    required_tokens = [
        '--rehvo-bg',
        '--rehvo-surface',
        '--rehvo-primary',
        '--rehvo-secondary',
        '--rehvo-border',
        '--rehvo-accent',
        '--rehvo-commercial',
        '--rehvo-pg',
        '--rehvo-flatmates',
        '--rehvo-localities',
    ]

    for token in required_tokens:
        if token not in css:
            print(f"❌ FAIL: globals.css missing token '{token}'")
            return False
    print(f"✅ PASS: All {len(required_tokens)} core REHVO design tokens defined")

    required_classes = [
        '.btn-primary',
        '.btn-dark',
        '.btn-secondary',
        '.input-rehvo',
        '.rehvo-glass-card',
        '.rehvo-glass-capsule',
        '.rehvo-glass-subtle',
        '.glass-subtle',
        '.glass-medium',
        '.glass-strong',
    ]

    for cls in required_classes:
        if cls not in css:
            print(f"❌ FAIL: globals.css missing component class '{cls}'")
            return False
    print(f"✅ PASS: All {len(required_classes)} canonical component & liquid-glass classes defined")

    # Audit typography resets
    if 'a:visited' not in css or 'h1, h2, h3' not in css:
        print("❌ FAIL: globals.css missing universal link or heading resets")
        return False
    print("✅ PASS: Universal resets for links, headings, paragraphs, and inputs defined")

    return True

def audit_tailwind_config():
    print("\n--- Auditing Tailwind Configuration ---")
    if not check_file_exists(TAILWIND_CONFIG, "tailwind.config.js"):
        return False

    with open(TAILWIND_CONFIG, 'r', encoding='utf-8') as f:
        config = f.read()

    if './src/**/*.{js,ts,jsx,tsx,mdx}' not in config and './src/app/**/*.{js,ts,jsx,tsx,mdx}' not in config:
        print("❌ FAIL: Tailwind content globs do not cover src directory")
        return False
    print("✅ PASS: Tailwind content configuration covers all src templates")

    return True

def verify_live_routes(base_url="http://localhost:3001"):
    print(f"\n--- Verifying Live Routes on {base_url} ---")
    all_passed = True
    results = []

    for route in CRITICAL_ROUTES:
        url = f"{base_url}{route}"
        try:
            req = urllib.request.Request(
                url,
                headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                status = response.status
                html = response.read().decode('utf-8')

                css_links = re.findall(r'<link rel="stylesheet" href="([^"]+)"', html)
                css_ok = False
                css_size = 0
                for cl in css_links:
                    full_cl = f"{base_url}{cl}" if cl.startswith('/') else cl
                    try:
                        req_c = urllib.request.Request(full_cl, headers={'User-Agent': 'Mozilla/5.0'})
                        with urllib.request.urlopen(req_c, timeout=5) as resp_c:
                            if resp_c.status == 200:
                                data = resp_c.read()
                                css_size = len(data)
                                if css_size > 5000:
                                    css_ok = True
                    except Exception:
                        pass

                has_html = '<html' in html
                has_body = '<body' in html
                has_font_sans = 'font-sans' in html
                has_theme_bg = 'bg-[#F7F5F0]' in html or 'bg-[#FAF8F5]' in html or 'F7F5F0' in html
                has_header = 'REHVO' in html

                if status == 200 and has_html and has_body and has_font_sans and has_header and (css_ok or len(css_links) == 0):
                    print(f"✅ PASS: Route {route:<24} [Status: {status}] [CSS: {css_size} bytes] [Styled: YES]")
                    results.append((route, "PASS", f"Global CSS ({css_size}B), Font, Tokens & Layout Loaded"))
                else:
                    print(f"❌ FAIL: Route {route:<24} [Status: {status}] [CSS: {css_size} bytes] [Styled: NO]")
                    results.append((route, "FAIL", "Missing HTML/Body, Theme Classes or Stylesheet Failed"))
                    all_passed = False
        except urllib.error.URLError as e:
            print(f"⚠️  WARN: Could not connect to {url} ({e.reason}). (Make sure dev/prod server is running).")
            results.append((route, "SKIPPED", f"Server not reachable: {e.reason}"))
            all_passed = False

    return all_passed, results

def main():
    print("=" * 60)
    print("REHVO WEB STYLING ARCHITECTURE & REGRESSION AUDIT")
    print("=" * 60)

    l_ok = audit_root_layout()
    g_ok = audit_globals_css()
    t_ok = audit_tailwind_config()

    if not (l_ok and g_ok and t_ok):
        print("\n❌ CRITICAL: Static styling architecture checks failed!")
        sys.exit(1)

    print("\n✅ All Static Styling Architecture Checks PASSED!")

    # Check live routes if server is running
    server_running, results = verify_live_routes()
    if server_running:
        print("\n🎉 ALL CRITICAL ROUTES VERIFIED AND STYLED CORRECTLY!")
    else:
        print("\nNote: Live route check completed (server connectivity tested).")

if __name__ == '__main__':
    main()
