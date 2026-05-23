"""
COST MANAGER FRONTEND - CODE VALIDATION AGENT
==============================================

This script validates that a Cost Manager project meets all code quality requirements.

VALIDATION CATEGORIES:
======================

PROJECT CODE REQUIREMENTS (Checked by this script):
---
B1:  Comment density - At least 1 comment per 7-9 lines of code
C1:  Variable/function naming - Must follow camelCase or PascalCase conventions
C3:  Filename format - All filenames must be lowercase with underscores (e.g., my_file.js)
C5:  Code alignment - All code must be left-aligned (no excessive indentation)
D1:  Variable declarations - Must use 'const' or 'let', NO 'var' keyword
E1/E2/E3: db.js interface - Must expose window.db with required methods: 
          openCostsDB(), addCost(), getReport()

See FINAL_CHECKLIST.md and README.md for complete project requirements.
"""

import os
import sys
import re

# Strict Grading Standard Baseline Mapping
ERRORS = {
    "B1": "Missing comments in code structure (Rule: At least 1 comment per 7-9 lines).",
    "C1": "Naming violation: Target does not conform to standard camelCase or PascalCase syntax structures.",
    "C3": "Filename format exception: Asset tracks uppercase text characters or missing separator spacing rules.",
    "C5": "Code layout distortion: Found blocks that are not strictly left-aligned.",
    "D1": "Variable scope syntax violation: Found instances of 'var' instead of mandatory 'const' reassignments.",
    "E1_E2_E3": "Runtime interface validation failure matching required method definitions."
}

def scan_naming_conventions():
    """Validates Rule C3: Lowercase filenames with underscore spacing rules."""
    print("Executing Checklist C3: Filename validation checks...")
    for root, dirs, files in os.walk("."):
        if "node_modules" in root or ".git" in root or "dist" in root or "build" in root:
            continue
        for file in files:
            if file.endswith(('.js', '.jsx', '.css', '.html')):
                # Filter structural framework metadata tracking files
                if file in ['package.json', 'package-lock.json', 'vite.config.js']:
                    continue
                if not re.match(r"^[a-z0-9_]+(\.[a-z0-9_]+)+$", file):
                    print(f"[REJECT C3] Invalid filename format: '{os.path.join(root, file)}'")
                    print("-> Standard: Filenames must be completely lowercase with underscores separating words.")
                    return False
    return True

def scan_naming_conventions_c1():
    """Validates Rule C1: Variable and function names follow camelCase or PascalCase."""
    print("Executing Checklist C1: Variable and function naming convention checks...")
    for root, dirs, files in os.walk("."):
        if "node_modules" in root or ".git" in root or "dist" in root or "build" in root:
            continue
        for file in files:
            if file.endswith(('.js', '.jsx')):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    lines = f.readlines()
                
                for idx, line in enumerate(lines, 1):
                    cleaned_line = line.strip()
                    
                    # Skip comments and empty lines
                    if not cleaned_line or cleaned_line.startswith('//') or cleaned_line.startswith('*'):
                        continue
                    
                    # Check for snake_case variable declarations (forbidden except for CONSTANTS)
                    # Pattern: const/let/var snake_case_name (but allow UPPER_SNAKE for constants)
                    snake_case_pattern = r"\b(const|let|var)\s+([a-z][a-z0-9]*_[a-z0-9_]*)\s*="
                    match = re.search(snake_case_pattern, cleaned_line)
                    if match and not match.group(2).isupper():
                        print(f"[REJECT C1] Invalid naming convention at {file_path}:{idx}")
                        print(f"   Found: {match.group(2)} -> Use camelCase instead (e.g., my_var -> myVar)")
                        return False
    return True

def scan_code_quality():
    """Validates Checklist Items B1, C5, and D1 directly across code streams."""
    print("Executing Code Quality Line Scans...")
    for root, dirs, files in os.walk("."):
        if "node_modules" in root or ".git" in root or "dist" in root or "build" in root:
            continue
        for file in files:
            if file.endswith(('.js', '.jsx')):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    lines = f.readlines()
                
                comment_count = 0
                code_lines = 0
                total_lines = len(lines)
                in_multiline_comment = False
                
                for idx, line in enumerate(lines, 1):
                    cleaned_line = line.strip()
                    
                    # Track multi-line comments
                    if "/*" in cleaned_line:
                        in_multiline_comment = True
                    if "*/" in cleaned_line:
                        in_multiline_comment = False
                        comment_count += 1
                        continue
                    
                    if in_multiline_comment or cleaned_line.startswith('*'):
                        comment_count += 1
                        continue
                    
                    # Skip empty lines and comment-only lines
                    if not cleaned_line:
                        continue
                    
                    if cleaned_line.startswith('//'):
                        comment_count += 1
                        continue
                    
                    # This is a code line
                    code_lines += 1
                    
                    # Checklist D1: Ban the usage of 'var' variables
                    if re.search(r"\bvar\b", cleaned_line) and not "window.var" in cleaned_line:
                        print(f"[REJECT D1] Prohibited 'var' declaration located inside: {file_path} at Line {idx}")
                        return False
                    
                    # Checklist C5: Stop centered or right-aligned code strings
                    if line.startswith(" " * 20) and len(cleaned_line) > 0:
                        if re.search(r"^\s{24,}", line):
                            print(f"[REJECT C5] Code lines are offset from the left gutter edge. Fix alignments at Line {idx} in {file}")
                            return False
                    
                    # Inline comment check
                    if "//" in cleaned_line:
                        comment_count += 1
                
                # Checklist B1: Enforce code explanation loops (1 comment per 7-9 lines)
                if code_lines > 10:
                    required_comments = code_lines / 9
                    if comment_count < required_comments:
                        print(f"[REJECT B1] Inadequate documentation volume located inside: {file_path}")
                        print(f"-> Found {comment_count} comments for {code_lines} lines of code (need at least {required_comments:.1f}).")
                        return False
    return True

def verify_vanilla_db_file():
    """Validates Section 2 & 5: Check that db.js properly exposes required methods on window object."""
    print("Checking Vanilla db.js boundary registration patterns...")
    vanilla_db_path = "db.js"
    
    required_methods = ["openCostsDB", "addCost", "getReport"]
    
    if os.path.exists(vanilla_db_path):
        with open(vanilla_db_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if db is exposed on window
        if "window.db" not in content and "window['db']" not in content:
            print("[REJECT E1_E2_E3] Vanilla db.js file fails to assign the 'db' variable onto the global window object!")
            return False
        
        # Check if all required methods are defined
        missing_methods = []
        for method in required_methods:
            if f"{method}" not in content:
                missing_methods.append(method)
        
        if missing_methods:
            print(f"[REJECT E1_E2_E3] db.js is missing required methods: {', '.join(missing_methods)}")
            print(f"   Required methods: openCostsDB(databaseName, databaseVersion), addCost(cost), getReport(currency, year, month)")
            return False
    else:
        print("[WARNING] Global standalone backup db.js placeholder file not found at project root level.")
        print("         -> Vanilla db.js must be included as a separate submission file.")
    
    return True

if __name__ == "__main__":
    print("====================================================")
    print("      INITIALIZING COMPLIANCE PIPELINE AGENT        ")
    print("====================================================\n")
    
    print("=" * 50)
    print("PROJECT CODE REQUIREMENTS VALIDATION")
    print("=" * 50)
    
    if not scan_naming_conventions():
        sys.exit(1)
    if not scan_naming_conventions_c1():
        sys.exit(1)
    if not scan_code_quality():
        sys.exit(1)
    if not verify_vanilla_db_file():
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("[SUCCESS] Code validation complete!")
    print("====================================================")