// ===== SECRET NOTEPAD WITH GITHUB GIST INTEGRATION =====
// 
// KEYBOARD SHORTCUTS (Conflict-Free):
// =====================================
// 
// GLOBAL (anywhere on page):
//   ` ` ` (triple backtick) - Toggle notepad (tap backtick 3 times quickly)
//   Esc                     - Close notepad/modals
// 
// INSIDE NOTEPAD:
//   Ctrl+S                 - Save to Gist
//   Ctrl+Alt+N             - New file
//   Esc                    - Close notepad
// 
// TOKEN STORAGE:
//   - Token is stored in a PRIVATE GitHub Gist named ".notepad-config"
//   - Once you enter your token, it syncs across ALL devices automatically
//   - You only need to enter it ONCE EVER (unless you revoke it)
// 
// =====================================

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        storageKey: 'notepad_github_token',
        configGistName: '.notepad-config', // Special gist to store config
        gistApiUrl: 'https://api.github.com/gists',
        defaultTheme: 'dark',
        defaultFont: "'Courier New', monospace",
        defaultFontSize: '16px',
        tripleKeyTimeout: 600 // milliseconds between backtick presses
    };

    // DOM Elements
    let notepadModal, editor, filenameInput, charCount, statusText;
    let fontFamilySelect, fontSizeSelect, themeSelect;
    let newBtn, saveBtn, loadBtn, listBtn, closeBtn;
    let gistListModal, gistListContainer, gistCloseBtn;
    let gistSettingsModal, githubTokenInput, saveTokenBtn, settingsCloseBtn;

    // State
    let currentGistId = null;
    let backtickPressCount = 0;
    let backtickTimer = null;
    let isTokenLoaded = false;

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        // Get DOM elements
        notepadModal = document.getElementById('secret-notepad');
        editor = document.getElementById('notepad-editor');
        filenameInput = document.getElementById('notepad-filename');
        charCount = document.getElementById('notepad-char-count');
        statusText = document.getElementById('notepad-status-text');
        
        fontFamilySelect = document.getElementById('font-family');
        fontSizeSelect = document.getElementById('font-size');
        themeSelect = document.getElementById('editor-theme');
        
        newBtn = document.getElementById('notepad-new');
        saveBtn = document.getElementById('notepad-save');
        loadBtn = document.getElementById('notepad-load');
        listBtn = document.getElementById('notepad-list');
        closeBtn = document.getElementById('notepad-close');
        
        gistListModal = document.getElementById('gist-list-modal');
        gistListContainer = document.getElementById('gist-list-container');
        gistCloseBtn = document.querySelector('.gist-close-btn');
        
        gistSettingsModal = document.getElementById('gist-settings-modal');
        githubTokenInput = document.getElementById('github-token');
        saveTokenBtn = document.getElementById('save-token-btn');
        settingsCloseBtn = document.querySelector('.gist-settings-close-btn');

        if (!notepadModal || !editor) {
            console.error('Notepad elements not found');
            return;
        }

        // Set up event listeners
        setupEventListeners();
        
        // Apply default settings
        applyEditorSettings();
        
        // Try to auto-load token from GitHub Gist
        autoLoadToken();
    }

    function setupEventListeners() {
        // Secret keyboard shortcut (Triple backtick only)
        document.addEventListener('keydown', handleSecretKeyPress);

        // Notepad controls
        newBtn.addEventListener('click', createNewFile);
        saveBtn.addEventListener('click', saveToGist);
        loadBtn.addEventListener('click', () => showGistSettings());
        listBtn.addEventListener('click', listGists);
        closeBtn.addEventListener('click', closeNotepad);

        // Editor events
        editor.addEventListener('input', updateCharCount);
        
        // Font and theme controls
        fontFamilySelect.addEventListener('change', applyEditorSettings);
        fontSizeSelect.addEventListener('change', applyEditorSettings);
        themeSelect.addEventListener('change', applyEditorSettings);

        // Keyboard shortcuts within notepad
        editor.addEventListener('keydown', handleEditorShortcuts);

        // Gist modal controls
        gistCloseBtn.addEventListener('click', () => gistListModal.classList.remove('active'));
        settingsCloseBtn.addEventListener('click', () => gistSettingsModal.classList.remove('active'));
        saveTokenBtn.addEventListener('click', saveGithubToken);

        // Close modals on backdrop click
        gistListModal.addEventListener('click', (e) => {
            if (e.target === gistListModal) {
                gistListModal.classList.remove('active');
            }
        });
        
        gistSettingsModal.addEventListener('click', (e) => {
            if (e.target === gistSettingsModal) {
                gistSettingsModal.classList.remove('active');
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (gistListModal.classList.contains('active')) {
                    gistListModal.classList.remove('active');
                } else if (gistSettingsModal.classList.contains('active')) {
                    gistSettingsModal.classList.remove('active');
                } else if (notepadModal.classList.contains('active')) {
                    closeNotepad();
                }
            }
        });
    }

    function handleSecretKeyPress(e) {
        // Only method: Triple backtick press
        if (e.key === '`' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
            // Only count if not inside an input or textarea (except our notepad)
            const activeElement = document.activeElement;
            const isInInput = activeElement && (
                activeElement.tagName === 'INPUT' || 
                activeElement.tagName === 'TEXTAREA'
            ) && activeElement.id !== 'notepad-editor';
            
            if (isInInput) return;
            
            backtickPressCount++;
            
            // Clear previous timer
            if (backtickTimer) {
                clearTimeout(backtickTimer);
            }
            
            // Check if we got 3 presses
            if (backtickPressCount === 3) {
                e.preventDefault();
                toggleNotepad();
                backtickPressCount = 0;
                return;
            }
            
            // Reset counter after timeout
            backtickTimer = setTimeout(() => {
                backtickPressCount = 0;
            }, CONFIG.tripleKeyTimeout);
        }
    }

    function handleEditorShortcuts(e) {
        // Ctrl+S to save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveToGist();
        }
        
        // Ctrl+Alt+N for new file (avoiding Ctrl+N which opens new window)
        if (e.ctrlKey && e.altKey && e.key === 'n') {
            e.preventDefault();
            createNewFile();
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
        editor.focus();
        updateStatus('Ready');
    }

    function closeNotepad() {
        notepadModal.classList.remove('active');
        backtickPressCount = 0;
    }

    function createNewFile() {
        if (editor.value && !confirm('Create new file? Current content will be cleared.')) {
            return;
        }
        
        editor.value = '';
        filenameInput.value = 'untitled.txt';
        currentGistId = null;
        updateCharCount();
        updateStatus('New file created');
        editor.focus();
    }

    function updateCharCount() {
        const count = editor.value.length;
        charCount.textContent = `${count} character${count !== 1 ? 's' : ''}`;
    }

    function updateStatus(message, isError = false) {
        statusText.textContent = message;
        statusText.style.color = isError ? '#ff6b6b' : '#667eea';
    }

    function applyEditorSettings() {
        const font = fontFamilySelect.value;
        const size = fontSizeSelect.value;
        const theme = themeSelect.value;
        
        editor.style.fontFamily = font;
        editor.style.fontSize = size;
        editor.setAttribute('data-theme', theme);
    }

    // ===== GITHUB GIST API FUNCTIONS =====

    async function autoLoadToken() {
        // First check localStorage for a temporary token
        const localToken = localStorage.getItem(CONFIG.storageKey);
        
        if (localToken) {
            // We have a token, try to load config from gist
            updateStatus('Loading your settings...');
            
            try {
                const config = await loadConfigFromGist(localToken);
                if (config && config.token) {
                    // Token found in gist, use it
                    localStorage.setItem(CONFIG.storageKey, config.token);
                    githubTokenInput.value = config.token;
                    isTokenLoaded = true;
                    updateStatus('Settings loaded successfully!');
                } else {
                    // No config in gist, save current token to gist
                    await saveConfigToGist(localToken, { token: localToken });
                    githubTokenInput.value = localToken;
                    isTokenLoaded = true;
                    updateStatus('Ready');
                }
            } catch (error) {
                console.error('Token sync error:', error);
                // Keep using local token
                githubTokenInput.value = localToken;
                isTokenLoaded = true;
                updateStatus('Ready (using local token)');
            }
        } else {
            // No token found
            updateStatus('Setup required - Click Save or Load to add GitHub token');
        }
    }

    async function loadConfigFromGist(token) {
        try {
            // Search for our config gist
            const response = await fetch(`${CONFIG.gistApiUrl}?per_page=100`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) return null;

            const gists = await response.json();
            const configGist = gists.find(g => 
                g.files[CONFIG.configGistName] !== undefined
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
            // Check if config gist exists
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
                // Update existing config
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
                // Create new config gist
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
        
        updateStatus('Saving token and syncing...');
        
        // Save to localStorage first
        localStorage.setItem(CONFIG.storageKey, token);
        
        // Save to GitHub Gist for cross-device sync
        try {
            await saveConfigToGist(token, { token: token });
            gistSettingsModal.classList.remove('active');
            isTokenLoaded = true;
            updateStatus('Token saved and synced! You won\'t need to enter it again on any device.');
        } catch (error) {
            console.error('Token sync error:', error);
            gistSettingsModal.classList.remove('active');
            isTokenLoaded = true;
            updateStatus('Token saved locally (sync failed, but you can still use it)');
        }
    }

    function showGistSettings() {
        gistSettingsModal.classList.add('active');
        githubTokenInput.focus();
    }

    async function saveToGist() {
        const token = getGithubToken();
        if (!token) return;

        const filename = filenameInput.value.trim() || 'untitled.txt';
        const content = editor.value;

        if (!content) {
            updateStatus('Cannot save empty file', true);
            return;
        }

        updateStatus('Saving to Gist...');
        
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
            
            if (currentGistId) {
                // Update existing gist
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
                // Create new gist
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
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const result = await response.json();
            currentGistId = result.id;
            
            updateStatus(`Saved successfully! (Gist ID: ${currentGistId})`);
        } catch (error) {
            console.error('Save error:', error);
            updateStatus(`Save failed: ${error.message}`, true);
        }
    }

    async function listGists() {
        const token = getGithubToken();
        if (!token) return;

        gistListModal.classList.add('active');
        gistListContainer.innerHTML = '<p class="loading">Loading your gists...</p>';

        try {
            const response = await fetch(`${CONFIG.gistApiUrl}?per_page=50`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const gists = await response.json();
            
            // Filter gists created by notepad (contain "Notepad:" in description)
            const notepadGists = gists.filter(g => 
                g.description && g.description.includes('Notepad:')
            );

            if (notepadGists.length === 0) {
                gistListContainer.innerHTML = '<p style="text-align: center; color: #b0b0b0;">No saved notes found. Create one by saving your first note!</p>';
                return;
            }

            displayGistList(notepadGists);
        } catch (error) {
            console.error('List error:', error);
            gistListContainer.innerHTML = `<p style="color: #ff6b6b; text-align: center;">Failed to load gists: ${error.message}</p>`;
        }
    }

    function displayGistList(gists) {
        gistListContainer.innerHTML = '';
        
        gists.forEach(gist => {
            const gistItem = document.createElement('div');
            gistItem.className = 'gist-item';
            
            const filename = Object.keys(gist.files)[0];
            const fileContent = gist.files[filename];
            const preview = fileContent.content.substring(0, 100);
            const date = new Date(gist.updated_at).toLocaleDateString();
            
            gistItem.innerHTML = `
                <div class="gist-item-title">${filename}</div>
                <div class="gist-item-desc">${preview}${fileContent.content.length > 100 ? '...' : ''}</div>
                <div class="gist-item-meta">
                    <span>📅 ${date}</span>
                    <span>📝 ${fileContent.content.length} chars</span>
                    <span>🔗 ${gist.id.substring(0, 8)}</span>
                </div>
            `;
            
            gistItem.addEventListener('click', () => loadGist(gist));
            gistListContainer.appendChild(gistItem);
        });
    }

    function loadGist(gist) {
        const filename = Object.keys(gist.files)[0];
        const fileContent = gist.files[filename];
        
        editor.value = fileContent.content;
        filenameInput.value = filename;
        currentGistId = gist.id;
        
        updateCharCount();
        updateStatus(`Loaded: ${filename}`);
        gistListModal.classList.remove('active');
        editor.focus();
    }

    // Expose to global scope for debugging (optional)
    window.secretNotepad = {
        open: openNotepad,
        close: closeNotepad,
        version: '1.0.0'
    };

})();
