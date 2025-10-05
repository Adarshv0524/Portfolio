# Notepad v3.0 - Quick Reference

## Access
```
Press:  `  `  `  (triple backtick within 600ms)
```

## Keyboard Shortcuts
```
Ctrl + S         → Save to GitHub Gist
Ctrl + Alt + N   → New file
Ctrl + B         → Toggle sidebar
Ctrl + Space     → Auto-complete
Esc              → Close notepad
```

## UI Elements
```
Header:
  ⚙️ (tiny)     → Token settings (opacity 30%, hover to see)
  📂           → Toggle sidebar
  📄 New       → Create new file
  💾 Save      → Save to Gist
  ⬇️ Download  → Download file
  🔄 Auto-Save → Toggle 30s auto-save
  ✕           → Close

Toolbar:
  Filename     → Auto-detects language from extension
  Language     → 12 languages (JS, Python, Java, C++, Dart, HTML, CSS, MD, JSON, XML, SQL, Text)
  Size         → Font size (12-20px)
  Theme        → Light, Dark, Monokai, Dracula, Nord

Sidebar:
  Search       → Filter notes by name
  Type Filter  → All, Code, Markdown, Text
  Notes List   → Click to load note

Status Bar:
  Ln X, Col Y  → Cursor position
  X lines      → Line count
  X words      → Word count
  X characters → Character count
  Status       → Current operation
```

## Token Setup (First Time)
```
1. Open notepad (triple backtick)
2. Type something
3. Click Save → Token prompt appears
4. Go to: https://github.com/settings/tokens
5. Create token with "gist" permission
6. Paste token (starts with ghp_)
7. Click "Save Token"
8. Done! Token auto-syncs to all devices
```

## Cross-Device Usage
```
Device 1: Enter token once
Device 2: Token auto-loads from GitHub Gist
Device 3: Token auto-loads from GitHub Gist
...
No re-entry needed! 🎉
```

## File Management
```
Save:    Click Save or Ctrl+S
Load:    Click note in sidebar
New:     Click New or Ctrl+Alt+N
Delete:  Go to github.com/gists → Delete manually
```

## Themes
```
Light:    Subtle gray active line (#f0f0f0)
Dark:     VSCode-like (#282828 active line)
Monokai:  Classic programmer theme
Dracula:  Purple-tinted dark theme
Nord:     Cool blue-gray theme
```

## Language Detection
```
.js    → JavaScript
.py    → Python
.java  → Java
.cpp   → C/C++
.dart  → Dart
.html  → HTML
.css   → CSS
.md    → Markdown
.json  → JSON
.xml   → XML
.sql   → SQL
.txt   → Plain Text
```

## Auto-Complete
```
Trigger:     Ctrl + Space
Auto-Trigger: Type 2+ characters
Works with:   All languages (anyword-hint)
Features:     Context-aware suggestions
```

## Troubleshooting

**Notes not loading?**
→ Check token: Click ⚙️ → Verify token is valid

**Save failing?**
→ Error message shows:
  - "Invalid token" → Regenerate token
  - "API error" → Check GitHub status

**Token not syncing?**
→ Check internet connection
→ Verify Gist API access
→ Falls back to local token automatically

**Sidebar empty?**
→ Create your first note!
→ Or click ⚙️ to add token

## Privacy & Security
```
✅ All notes are PRIVATE Gists
✅ Token stored in private .notepad-config Gist
✅ Only you can access your notes
✅ No data sent to third parties
✅ Works 100% client-side
```

## Best Practices
```
1. Use descriptive filenames (my_script.py)
2. Enable auto-save for long sessions
3. Download important code as backup
4. Don't delete .notepad-config Gist
5. Revoke old tokens if compromised
```

## Visual Design
```
Colors:
  Background: #1a1a1a (main), #151515 (sidebar)
  Text:       #ccc (main), #666 (labels)
  Accent:     #667eea (links/status)
  Border:     rgba(255,255,255,0.06)

Typography:
  Code:   Consolas, Monaco, Courier New
  UI:     Inter, system-ui

Spacing:
  Minimal padding and gaps
  Clean borders
  Subtle shadows
```

---
v3.0 | Minimal & Professional | Cross-Device Token Sync
