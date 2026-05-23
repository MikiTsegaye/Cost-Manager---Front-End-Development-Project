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
                total_lines = len(lines)
                
                for idx, line in enumerate(lines, 1):
                    cleaned_line = line.strip()
                    
                    # Checklist D1: Ban the usage of 'var' variables
                    if re.search(r"\bvar\b", cleaned_line) and not "window.var" in cleaned_line:
                        print(f"[REJECT D1] Prohibited 'var' declaration located inside: {file_path} at Line {idx}")
                        return False
                    
                    # Checklist C5: Stop centered or right-aligned code strings
                    if line.startswith(" " * 20) and len(cleaned_line) > 0 and not cleaned_line.startswith(('*', '//')):
                        # Allow deep nested closures but highlight massive off-center inline spacing blocks
                        if re.search(r"^\s{24,}", line):
                            print(f"[REJECT C5] Code lines are offset from the left gutter edge. Fix alignments at Line {idx} in {file}")
                            return False
                    
                    # Track comment frequency blocks
                    if "//" in cleaned_line or "/*" in cleaned_line or cleaned_line.startswith("*"):
                        comment_count += 1
                
                # Checklist B1: Enforce code explanation loops
                if total_lines > 10 and comment_count < (total_lines / 9):
                    print(f"[REJECT B1] Inadequate documentation volume located inside: {file_path}")
                    print(f"-> Found only {comment_count} explanatory comments across {total_lines} lines of functional code.")
                    return False
    return True

def verify_vanilla_db_file():
    """Validates Section 2 & 5: Check that the testing boundary logic registers DB on window object."""
    print("Checking Vanilla db.js boundary registration patterns...")
    vanilla_db_path = "db.js"
    if os.path.exists(vanilla_db_path):
        with open(vanilla_db_path, 'r', encoding='utf-8') as f:
            content = f.read()
        if "window.db" not in content and "window['db']" not in content:
            # Check for alternative instructor validation structures
            if "openCostsDB" in content and not ("window." in content or "db =" in content):
                print("[REJECT E1_E2_E3] Vanilla db.js file fails to assign the 'db' variable tracking module onto the global window wrapper object!")
                return False
    else:
        print("[WARNING] Global standalone backup db.js placeholder file not found at project root level yet.")
    return True

if __name__ == "__main__":
    print("====================================================")
    print("      INITIALIZING COMPLIANCE PIPELINE AGENT        ")
    print("====================================================")
    
    if not scan_naming_conventions():
        sys.exit(1)
    if not scan_code_quality():
        sys.exit(1)
    if not verify_vanilla_db_file():
        sys.exit(1)
        
    print("\n[SUCCESS] Local directory environment conforms to all grading instructions!")
    print("====================================================")