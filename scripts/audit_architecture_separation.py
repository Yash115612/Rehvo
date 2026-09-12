import os
import re
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

violations = []

def check_file_imports(file_path, app_name):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    lines = content.split('\n')
    for idx, line in enumerate(lines, 1):
        # Ignore comments
        stripped = line.strip()
        if stripped.startswith('//') or stripped.startswith('/*') or stripped.startswith('*'):
            continue

        if app_name == 'mobile':
            # Mobile must NOT import next.js or web/admin paths
            if re.search(r"from\s+['\"]next[/'\"]", line) or re.search(r"require\(['\"]next[/'\"]", line):
                violations.append(f"[MOBILE IMPORT NEXT.JS] {file_path}:{idx}: {line}")
            if re.search(r"from\s+['\"].*(\.\./web|web/src|\.\./admin|admin/src)", line):
                violations.append(f"[MOBILE IMPORT WEB/ADMIN] {file_path}:{idx}: {line}")
            if 'globals.css' in line:
                violations.append(f"[MOBILE IMPORT CSS] {file_path}:{idx}: {line}")

        elif app_name == 'web':
            # Web must NOT import react-native or expo or mobile/admin paths
            if re.search(r"from\s+['\"]react-native['\"]", line) or re.search(r"require\(['\"]react-native['\"]", line):
                violations.append(f"[WEB IMPORT REACT-NATIVE] {file_path}:{idx}: {line}")
            if re.search(r"from\s+['\"]expo[-/]", line):
                violations.append(f"[WEB IMPORT EXPO] {file_path}:{idx}: {line}")
            if re.search(r"from\s+['\"].*(\.\./src|\.\./\.\./src|\.\./admin|admin/src)", line):
                violations.append(f"[WEB IMPORT MOBILE/ADMIN] {file_path}:{idx}: {line}")

        elif app_name == 'admin':
            # Admin must NOT import react-native, expo, mobile, or web UI
            if re.search(r"from\s+['\"]react-native['\"]", line) or re.search(r"require\(['\"]react-native['\"]", line):
                violations.append(f"[ADMIN IMPORT REACT-NATIVE] {file_path}:{idx}: {line}")
            if re.search(r"from\s+['\"]expo[-/]", line):
                violations.append(f"[ADMIN IMPORT EXPO] {file_path}:{idx}: {line}")
            if re.search(r"from\s+['\"].*(\.\./src|\.\./\.\./src|\.\./web|web/src)", line):
                violations.append(f"[ADMIN IMPORT MOBILE/WEB] {file_path}:{idx}: {line}")

def audit_directory(dir_path, app_name):
    if not os.path.exists(dir_path):
        return
    for root, dirs, files in os.walk(dir_path):
        # Skip node_modules and .next
        if 'node_modules' in root or '.next' in root or '.git' in root or 'dist' in root:
            continue
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                check_file_imports(os.path.join(root, file), app_name)

print("Starting REHVO 3-App Architecture Separation Audit...")

# 1. Audit Mobile (app/ and src/)
audit_directory(os.path.join(ROOT_DIR, 'app'), 'mobile')
audit_directory(os.path.join(ROOT_DIR, 'src'), 'mobile')

# 2. Audit Web (web/src/)
audit_directory(os.path.join(ROOT_DIR, 'web', 'src'), 'web')

# 3. Audit Admin (admin/src/)
audit_directory(os.path.join(ROOT_DIR, 'admin', 'src'), 'admin')

print(f"\nAudit complete. Violations found: {len(violations)}")
if violations:
    for v in violations:
        print(v)
    sys.exit(1)
else:
    print("SUCCESS: Zero cross-app or platform-boundary violations found across all three applications!")
    sys.exit(0)
