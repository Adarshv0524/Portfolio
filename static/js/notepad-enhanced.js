// ===== ENHANCED SECRET NOTEPAD WITH CODEMIRROR =====
// 
// FEATURES:
// - Syntax highlighting for multiple languages
// - Auto-complete and code hints
// - Line numbers and cursor position
// - Word/character count
// - Sidebar with notes list
// - Search and filter notes
// - Auto-save functionality
// - Download notes
// - Cross-device token sync via GitHub Gist
// 
// KEYBOARD SHORTCUTS:
//   ` ` ` (triple backtick) - Toggle notepad
//   Ctrl+S                  - Save to Gist
//   Ctrl+Alt+N              - New file
//   Ctrl+B                  - Toggle sidebar
//   Ctrl+Space              - Trigger autocomplete
//   Esc                     - Close notepad
// 
// VERIFIED COMPATIBILITY:
//   ✅ GitHub Pages (static hosting, client-side only)
//   ✅ Vercel (static hosting, client-side only)
//   ✅ GitHub Gist API (CORS enabled, public API)
// 
// ===================================================================

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        storageKey: 'notepad_github_token',
        configGistName: '.notepad-config',
        gistApiUrl: 'https://api.github.com/gists',
        defaultTheme: 'monokai',
        defaultLanguage: 'python',
        defaultFontSize: '16px',
        tripleKeyTimeout: 600,
        autoSaveInterval: 30000, // 30 seconds
        hardcodedToken: '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' // Hardcoded token
    };

    // DOM Elements
    let notepadModal, notepadMain, sidebar, sidebarNotesList;
    let filenameInput, languageSelect, fontSizeSelect, themeSelect;
    let newBtn, saveBtn, downloadBtn, autosaveToggleBtn, closeBtn, sidebarToggleBtn;
    let cursorPosSpan, lineCountSpan, wordCountSpan, charCountSpan, statusText;
    let sidebarSearchInput, sidebarFilterSelect, sidebarCloseBtn;
    let gistSettingsModal, githubTokenInput, saveTokenBtn, settingsCloseBtn;

    // CodeMirror instance
    let editor = null;

    // State
    let currentGistId = null;
    let backtickPressCount = 0;
    let backtickTimer = null;
    let isTokenLoaded = false;
    let autoSaveEnabled = false;
    let autoSaveTimer = null;
    let allNotes = [];
    let currentNoteIndex = -1;

    // Language to mode mapping
    const languageMap = {
        'javascript': 'javascript',
        'python': 'python',
        'java': 'text/x-java',
        'cpp': 'text/x-c++src',
        'dart': 'text/x-dart',
        'html': 'htmlmixed',
        'css': 'css',
        'markdown': 'markdown',
        'json': {name: 'javascript', json: true},
        'xml': 'xml',
        'sql': 'sql',
        'text': 'text'
    };

    // File extension to language mapping
    const extensionMap = {
        'js': 'javascript',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'cpp',
        'h': 'cpp',
        'dart': 'dart',
        'html': 'html',
        'htm': 'html',
        'css': 'css',
        'md': 'markdown',
        'json': 'json',
        'xml': 'xml',
        'sql': 'sql',
        'txt': 'text'
    };

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        // Get DOM elements
        notepadModal = document.getElementById('secret-notepad');
        notepadMain = document.querySelector('.notepad-main');
        sidebar = document.getElementById('notepad-sidebar');
        sidebarNotesList = document.getElementById('sidebar-notes-list');
        
        filenameInput = document.getElementById('notepad-filename');
        languageSelect = document.getElementById('language-select');
        fontSizeSelect = document.getElementById('font-size');
        themeSelect = document.getElementById('editor-theme');
        
        newBtn = document.getElementById('notepad-new');
        saveBtn = document.getElementById('notepad-save');
        downloadBtn = document.getElementById('notepad-download');
        autosaveToggleBtn = document.getElementById('notepad-autosave-toggle');
        closeBtn = document.getElementById('notepad-close');
        sidebarToggleBtn = document.getElementById('sidebar-toggle');
        
        cursorPosSpan = document.getElementById('notepad-cursor-pos');
        lineCountSpan = document.getElementById('notepad-line-count');
        wordCountSpan = document.getElementById('notepad-word-count');
        charCountSpan = document.getElementById('notepad-char-count');
        statusText = document.getElementById('notepad-status-text');
        
        sidebarSearchInput = document.getElementById('sidebar-search-input');
        sidebarFilterSelect = document.getElementById('sidebar-filter-type');
        sidebarCloseBtn = document.getElementById('sidebar-close');
        
        gistSettingsModal = document.getElementById('gist-settings-modal');
        githubTokenInput = document.getElementById('github-token');
        saveTokenBtn = document.getElementById('save-token-btn');
        settingsCloseBtn = document.querySelector('.gist-settings-close-btn');

        if (!notepadModal) {
            console.error('Notepad elements not found');
            return;
        }

        // Initialize CodeMirror
        initializeCodeMirror();
        
        // Set up event listeners
        setupEventListeners();
        
        // Try to auto-load token from GitHub Gist
        autoLoadToken();
    }

    function initializeCodeMirror() {
        const editorElement = document.getElementById('notepad-editor');
        
        editor = CodeMirror(editorElement, {
            mode: languageMap[CONFIG.defaultLanguage],
            theme: CONFIG.defaultTheme,
            lineNumbers: true,
            lineWrapping: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            styleActiveLine: true,
            indentUnit: 4,
            tabSize: 4,
            indentWithTabs: false,
            extraKeys: {
                'Ctrl-Space': 'autocomplete',
                'Ctrl-S': function(cm) {
                    saveToGist();
                    return false;
                },
                'Ctrl-Alt-N': function(cm) {
                    createNewFile();
                    return false;
                }
            },
            hintOptions: {
                completeSingle: false,
                alignWithWord: true,
                closeOnUnfocus: true
            }
        });

        // Enable autocomplete on input
        editor.on('inputRead', function(cm, change) {
            if (change.text[0] && /\w/.test(change.text[0])) {
                // Auto-trigger hints after typing a word character
                setTimeout(function() {
                    if (!cm.state.completionActive) {
                        cm.showHint({
                            completeSingle: false,
                            alignWithWord: true,
                            closeOnUnfocus: true
                        });
                    }
                }, 100);
            }
        });

        // Update stats on change
        editor.on('change', function() {
            updateEditorStats();
        });

        // Update cursor position on cursor activity
        editor.on('cursorActivity', function() {
            updateCursorPosition();
        });

        // Set initial font size
        editor.getWrapperElement().style.fontSize = CONFIG.defaultFontSize;
    }

    function setupEventListeners() {
        // Secret keyboard shortcut (Triple backtick only)
        document.addEventListener('keydown', handleSecretKeyPress);

        // Notepad controls
        newBtn.addEventListener('click', createNewFile);
        saveBtn.addEventListener('click', saveToGist);
        downloadBtn.addEventListener('click', downloadFile);
        autosaveToggleBtn.addEventListener('click', toggleAutoSave);
        closeBtn.addEventListener('click', closeNotepad);
        sidebarToggleBtn.addEventListener('click', toggleSidebar);
        sidebarCloseBtn.addEventListener('click', () => sidebar.classList.add('collapsed'));
        
        // Settings button
        const settingsBtn = document.getElementById('notepad-settings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                gistSettingsModal.classList.add('active');
            });
        }

        // Filename change
        filenameInput.addEventListener('change', handleFilenameChange);
        
        // Language and theme controls
        languageSelect.addEventListener('change', handleLanguageChange);
        fontSizeSelect.addEventListener('change', handleFontSizeChange);
        themeSelect.addEventListener('change', handleThemeChange);

        // Sidebar search and filter
        sidebarSearchInput.addEventListener('input', filterNotes);
        sidebarFilterSelect.addEventListener('change', filterNotes);

        // Settings modal
        settingsCloseBtn.addEventListener('click', () => gistSettingsModal.classList.remove('active'));
        saveTokenBtn.addEventListener('click', saveGithubToken);

        // Close modals on backdrop click
        gistSettingsModal.addEventListener('click', (e) => {
            if (e.target === gistSettingsModal) {
                gistSettingsModal.classList.remove('active');
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (gistSettingsModal.classList.contains('active')) {
                    gistSettingsModal.classList.remove('active');
                } else if (notepadModal.classList.contains('active')) {
                    closeNotepad();
                }
            }
        });

        // Keyboard shortcut for sidebar toggle
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'b' && notepadModal.classList.contains('active')) {
                e.preventDefault();
                toggleSidebar();
            }
        });
    }

    function handleSecretKeyPress(e) {
        // Only method: Triple backtick press
        if (e.key === '`' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
            const activeElement = document.activeElement;
            const isInInput = activeElement && (
                activeElement.tagName === 'INPUT' || 
                activeElement.tagName === 'TEXTAREA'
            ) && !activeElement.closest('.notepad-modal');
            
            if (isInInput) return;
            
            backtickPressCount++;
            
            if (backtickTimer) {
                clearTimeout(backtickTimer);
            }
            
            if (backtickPressCount === 3) {
                e.preventDefault();
                toggleNotepad();
                backtickPressCount = 0;
                return;
            }
            
            backtickTimer = setTimeout(() => {
                backtickPressCount = 0;
            }, CONFIG.tripleKeyTimeout);
        }
    }

    function toggleNotepad() {
        const isActive = notepadModal.classList.contains('active');
        
        if (isActive) {
            closeNotepad();
        } else {
            openNotepad();
        }
    }

    function openNotepad() {
        notepadModal.classList.add('active');
        
        // Refresh editor
        setTimeout(() => {
            editor.refresh();
            editor.focus();
        }, 100);
        
        // Load notes list
        loadNotesList();
        
        updateStatus('Ready');
    }

    function closeNotepad() {
        notepadModal.classList.remove('active');
        backtickPressCount = 0;
        
        // Stop auto-save if enabled
        if (autoSaveTimer) {
            clearInterval(autoSaveTimer);
        }
    }

    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');
        
        // Refresh editor after transition
        setTimeout(() => {
            editor.refresh();
        }, 300);
    }

    function createNewFile() {
        if (editor.getValue() && !confirm('Create new file? Current content will be cleared.')) {
            return;
        }
        
        editor.setValue('');
        filenameInput.value = 'untitled.txt';
        currentGistId = null;
        currentNoteIndex = -1;
        
        // Reset language to text
        languageSelect.value = 'text';
        handleLanguageChange();
        
        updateEditorStats();
        updateStatus('New file created');
        editor.focus();
        
        // Remove active state from all sidebar notes
        document.querySelectorAll('.sidebar-note-item').forEach(item => {
            item.classList.remove('active');
        });
    }

    function handleFilenameChange() {
        const filename = filenameInput.value.trim();
        if (!filename) {
            filenameInput.value = 'untitled.txt';
            return;
        }
        
        // Auto-detect language from extension
        const extension = filename.split('.').pop().toLowerCase();
        if (extensionMap[extension]) {
            languageSelect.value = extensionMap[extension];
            handleLanguageChange();
        }
    }

    function handleLanguageChange() {
        const language = languageSelect.value;
        const mode = languageMap[language] || 'text';
        editor.setOption('mode', mode);
        
        // Update autocomplete based on language
        if (language === 'javascript' || language === 'html' || language === 'css' || language === 'sql') {
            editor.setOption('extraKeys', {
                ...editor.getOption('extraKeys'),
                'Ctrl-Space': 'autocomplete'
            });
        }
    }

    function handleFontSizeChange() {
        const size = fontSizeSelect.value;
        editor.getWrapperElement().style.fontSize = size;
        editor.refresh();
    }

    function handleThemeChange() {
        const theme = themeSelect.value;
        editor.setOption('theme', theme);
    }

    function updateCursorPosition() {
        const cursor = editor.getCursor();
        cursorPosSpan.textContent = `Ln ${cursor.line + 1}, Col ${cursor.ch + 1}`;
    }

    function updateEditorStats() {
        const content = editor.getValue();
        const lines = editor.lineCount();
        const words = content.trim() ? content.trim().split(/\s+/).length : 0;
        const chars = content.length;
        
        lineCountSpan.textContent = `${lines} line${lines !== 1 ? 's' : ''}`;
        wordCountSpan.textContent = `${words} word${words !== 1 ? 's' : ''}`;
        charCountSpan.textContent = `${chars} character${chars !== 1 ? 's' : ''}`;
    }

    function updateStatus(message, type = 'normal') {
        statusText.textContent = message;
        statusText.className = '';
        
        if (type === 'saving') {
            statusText.classList.add('saving');
        } else if (type === 'error') {
            statusText.classList.add('error');
        } else if (type === 'success') {
            statusText.classList.add('success');
        } else if (type === 'warning') {
            statusText.classList.add('warning');
        }
    }

    function downloadFile() {
        const content = editor.getValue();
        const filename = filenameInput.value.trim() || 'untitled.txt';
        
        if (!content) {
            updateStatus('Cannot download empty file', 'error');
            return;
        }
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        updateStatus('File downloaded!', 'success');
    }

    function toggleAutoSave() {
        autoSaveEnabled = !autoSaveEnabled;
        const statusSpan = document.getElementById('autosave-status');
        
        if (autoSaveEnabled) {
            statusSpan.textContent = 'ON';
            autosaveToggleBtn.style.background = 'rgba(81, 207, 102, 0.2)';
            
            // Start auto-save timer
            autoSaveTimer = setInterval(() => {
                if (editor.getValue().trim()) {
                    saveToGist(true); // Silent save
                }
            }, CONFIG.autoSaveInterval);
            
            updateStatus('Auto-save enabled', 'success');
        } else {
            statusSpan.textContent = 'OFF';
            autosaveToggleBtn.style.background = '';
            
            // Stop auto-save timer
            if (autoSaveTimer) {
                clearInterval(autoSaveTimer);
                autoSaveTimer = null;
            }
            
            updateStatus('Auto-save disabled');
        }
    }

    // ===== GITHUB GIST API FUNCTIONS =====

    function getGithubToken() {
        // Always return hardcoded token
        return CONFIG.hardcodedToken;
    }

    async function autoLoadToken() {
        // Auto-load with hardcoded token - no user input needed
        const token = CONFIG.hardcodedToken;
        
        if (token) {
            updateStatus('Loading configuration...');
            localStorage.setItem(CONFIG.storageKey, token);
            githubTokenInput.value = token;
            isTokenLoaded = true;
            updateStatus('Ready', 'success');
            loadNotesList();
        }
    }

    async function loadConfigFromGist(token) {
        try {
            const response = await fetch(`${CONFIG.gistApiUrl}?per_page=100`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                console.error('Failed to load gists:', response.status, response.statusText);
                return null;
            }

            const gists = await response.json();
            const configGist = gists.find(g => 
                g.files && g.files[CONFIG.configGistName] !== undefined
            );

            if (configGist) {
                const configContent = configGist.files[CONFIG.configGistName].content;
                return JSON.parse(configContent);
            }

            return null;
        } catch (error) {
            console.error('Load config error:', error);
            return null;
        }
    }

    async function saveConfigToGist(token, config) {
        try {
            const response = await fetch(`${CONFIG.gistApiUrl}?per_page=100`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch gists');

            const gists = await response.json();
            const configGist = gists.find(g => 
                g.files[CONFIG.configGistName] !== undefined
            );

            const gistData = {
                description: 'Notepad Configuration (DO NOT DELETE)',
                public: false,
                files: {
                    [CONFIG.configGistName]: {
                        content: JSON.stringify(config, null, 2)
                    }
                }
            };

            if (configGist) {
                await fetch(`${CONFIG.gistApiUrl}/${configGist.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `token ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    body: JSON.stringify(gistData)
                });
            } else {
                await fetch(CONFIG.gistApiUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `token ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    body: JSON.stringify(gistData)
                });
            }
        } catch (error) {
            console.error('Save config error:', error);
        }
    }

    function getGithubToken() {
        const token = localStorage.getItem(CONFIG.storageKey);
        if (!token) {
            showGistSettings();
            return null;
        }
        return token;
    }

    function showGistSettings() {
        gistSettingsModal.classList.add('active');
        githubTokenInput.focus();
    }

    async function saveGithubToken() {
        const token = githubTokenInput.value.trim();
        
        if (!token) {
            alert('Please enter a valid GitHub token');
            return;
        }
        
        if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
            if (!confirm('This doesn\'t look like a GitHub token. Continue anyway?')) {
                return;
            }
        }
        
        updateStatus('Saving token and syncing...', 'saving');
        
        localStorage.setItem(CONFIG.storageKey, token);
        
        try {
            await saveConfigToGist(token, { token: token });
            gistSettingsModal.classList.remove('active');
            isTokenLoaded = true;
            updateStatus('Token saved and synced! You won\'t need to enter it again.', 'success');
            
            // Reload notes list
            loadNotesList();
        } catch (error) {
            console.error('Token sync error:', error);
            gistSettingsModal.classList.remove('active');
            isTokenLoaded = true;
            updateStatus('Token saved locally (sync failed, but you can still use it)');
        }
    }

    async function saveToGist(silent = false) {
        const token = getGithubToken();
        
        // If no token, show settings modal
        if (!token) {
            gistSettingsModal.classList.add('active');
            updateStatus('Please enter your GitHub token to save', 'warning');
            return;
        }

        const filename = filenameInput.value.trim() || 'untitled.txt';
        const content = editor.getValue();

        if (!content) {
            if (!silent) updateStatus('Cannot save empty file', 'error');
            return;
        }

        if (!silent) updateStatus('Saving to Gist...', 'saving');
        
        const gistData = {
            description: `Notepad: ${filename}`,
            public: false,
            files: {
                [filename]: {
                    content: content
                }
            }
        };

        try {
            let response;
            
            // Update existing gist or create new one
            if (currentGistId) {
                response = await fetch(`${CONFIG.gistApiUrl}/${currentGistId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `token ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    body: JSON.stringify(gistData)
                });
            } else {
                response = await fetch(CONFIG.gistApiUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `token ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    body: JSON.stringify(gistData)
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                console.error('GitHub API error:', errorData);
                throw new Error(`GitHub API error: ${response.status} - ${errorData.message || response.statusText}`);
            }

            const result = await response.json();
            currentGistId = result.id;
            
            if (!silent) {
                updateStatus(`✓ Saved successfully!`, 'success');
                setTimeout(() => updateStatus('Ready'), 2000);
            }
            
            // Reload notes list to show the new/updated note
            loadNotesList();
        } catch (error) {
            console.error('Save error:', error);
            if (!silent) {
                if (error.message.includes('401') || error.message.includes('Bad credentials')) {
                    updateStatus(`Save failed: Invalid GitHub token`, 'error');
                } else {
                    updateStatus(`Save failed: ${error.message}`, 'error');
                }
            }
        }
    }

    async function loadNotesList() {
        const token = getGithubToken();
        if (!token) {
            sidebarNotesList.innerHTML = '<p class="sidebar-empty">No token configured</p>';
            return;
        }

        try {
            const response = await fetch(`${CONFIG.gistApiUrl}?per_page=100`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                console.error('Failed to load gists:', response.status, response.statusText);
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const gists = await response.json();
            
            // Filter to only notepad files (exclude config gist)
            allNotes = gists.filter(g => 
                g.description && 
                g.description.startsWith('Notepad:') && 
                g.files &&
                !g.files[CONFIG.configGistName]
            );

            displayNotesList(allNotes);
        } catch (error) {
            console.error('Load notes error:', error);
            if (error.message.includes('401')) {
                sidebarNotesList.innerHTML = `<p class="sidebar-empty" style="color: #ff6b6b;">Invalid token - please update</p>`;
            } else {
                sidebarNotesList.innerHTML = `<p class="sidebar-empty" style="color: #ff6b6b;">Failed to load notes</p>`;
            }
        }
    }

    function displayNotesList(notes) {
        if (notes.length === 0) {
            sidebarNotesList.innerHTML = '<p class="sidebar-empty">No notes yet. Create your first note!</p>';
            return;
        }

        sidebarNotesList.innerHTML = '';
        
        notes.forEach((gist, index) => {
            const filename = Object.keys(gist.files)[0];
            const fileContent = gist.files[filename];
            const preview = fileContent.content.substring(0, 60).replace(/\n/g, ' ');
            const date = new Date(gist.updated_at).toLocaleDateString();
            const size = fileContent.size;
            
            // Get file icon based on extension
            const extension = filename.split('.').pop().toLowerCase();
            let icon = '📄';
            if (['js', 'py', 'java', 'cpp', 'c'].includes(extension)) icon = '💻';
            else if (['md', 'txt'].includes(extension)) icon = '📝';
            else if (['html', 'css'].includes(extension)) icon = '🌐';
            else if (['json', 'xml'].includes(extension)) icon = '📋';
            
            const noteItem = document.createElement('div');
            noteItem.className = 'sidebar-note-item';
            if (gist.id === currentGistId) noteItem.classList.add('active');
            
            noteItem.innerHTML = `
                <div class="sidebar-note-name">
                    <span class="sidebar-note-icon">${icon}</span>
                    ${filename}
                </div>
                <div class="sidebar-note-preview">${preview}${fileContent.content.length > 60 ? '...' : ''}</div>
                <div class="sidebar-note-meta">
                    <span>📅 ${date}</span>
                    <span>${formatFileSize(size)}</span>
                </div>
            `;
            
            noteItem.addEventListener('click', () => loadNote(gist, index));
            sidebarNotesList.appendChild(noteItem);
        });
    }

    function loadNote(gist, index) {
        const filename = Object.keys(gist.files)[0];
        const fileContent = gist.files[filename];
        
        editor.setValue(fileContent.content);
        filenameInput.value = filename;
        currentGistId = gist.id;
        currentNoteIndex = index;
        
        // Update active state
        document.querySelectorAll('.sidebar-note-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        
        // Auto-detect language
        handleFilenameChange();
        
        updateEditorStats();
        updateCursorPosition();
        updateStatus(`Loaded: ${filename}`, 'success');
        setTimeout(() => updateStatus('Ready'), 3000);
        
        editor.focus();
    }

    function filterNotes() {
        const searchTerm = sidebarSearchInput.value.toLowerCase();
        const filterType = sidebarFilterSelect.value;
        
        let filtered = allNotes;
        
        // Filter by type
        if (filterType !== 'all') {
            filtered = filtered.filter(gist => {
                const filename = Object.keys(gist.files)[0];
                const extension = filename.split('.').pop().toLowerCase();
                
                if (filterType === 'code') {
                    return ['js', 'py', 'java', 'cpp', 'c', 'html', 'css', 'sql'].includes(extension);
                } else if (filterType === 'markdown') {
                    return extension === 'md';
                } else if (filterType === 'text') {
                    return extension === 'txt';
                }
                return true;
            });
        }
        
        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(gist => {
                const filename = Object.keys(gist.files)[0];
                const content = gist.files[filename].content;
                return filename.toLowerCase().includes(searchTerm) || 
                       content.toLowerCase().includes(searchTerm);
            });
        }
        
        displayNotesList(filtered);
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    // Expose to global scope for debugging (optional)
    window.secretNotepad = {
        open: openNotepad,
        close: closeNotepad,
        version: '2.0.0-enhanced'
    };

})();
