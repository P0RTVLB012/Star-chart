// User Authentication System for Star Chart
const UserAuth = {
    // Get all users from localStorage
    getUsers: function() {
        return JSON.parse(localStorage.getItem('starchart_users') || '{}');
    },

    // Save users to localStorage
    saveUsers: function(users) {
        localStorage.setItem('starchart_users', JSON.stringify(users));
    },

    // Get current session
    getCurrentSession: function() {
        return JSON.parse(localStorage.getItem('starchart_session') || 'null');
    },

    // Save session
    saveSession: function(username) {
        const session = {
            username: username,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('starchart_session', JSON.stringify(session));
    },

    // Clear session
    clearSession: function() {
        localStorage.removeItem('starchart_session');
    },

    // Hash password using SHA-256 (using Web Crypto API for client-side security)
    hashPassword: async function(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // Synchronous version for compatibility (less secure but necessary for sync operations)
    hashPasswordSync: function(password) {
        // Fallback to basic hash if Web Crypto API is not available
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    },

    // Register new user (async version to handle async hashing)
    register: async function(username, password) {
        // Validation
        if (!username || !password) {
            return { success: false, message: 'Username and password are required' };
        }

        if (username.length < 3) {
            return { success: false, message: 'Username must be at least 3 characters' };
        }

        if (password.length < 4) {
            return { success: false, message: 'Password must be at least 4 characters' };
        }

        const users = this.getUsers();

        // Check if user already exists
        if (users[username]) {
            return { success: false, message: 'Username already exists' };
        }

        // Create new user (always as regular user, only Cyrus is admin)
        users[username] = {
            password: await this.hashPassword(password),
            createdAt: new Date().toISOString(),
            role: 'user'
        };

        this.saveUsers(users);

        return { success: true, message: 'Account created successfully!' };
    },

    // Login user (async version to handle async hashing)
    login: async function(username, password) {
        const users = this.getUsers();

        // Check if user exists
        if (!users[username]) {
            return { success: false, message: 'Invalid username or password' };
        }

        // Verify password
        const hashedPassword = await this.hashPassword(password);
        if (users[username].password !== hashedPassword) {
            return { success: false, message: 'Invalid username or password' };
        }

        // Create session
        this.saveSession(username);

        return { success: true, message: 'Login successful!' };
    },

    // Logout user
    logout: function() {
        this.clearSession();
        return { success: true, message: 'Logged out successfully' };
    },

    // Check if user is logged in
    isLoggedIn: function() {
        const session = this.getCurrentSession();
        return session !== null;
    },

    // Get current user
    getCurrentUser: function() {
        const session = this.getCurrentSession();
        return session ? session.username : null;
    },

    // Check if user is admin (only Cyrus)
    isAdmin: function() {
        const username = this.getCurrentUser();
        return username === 'Cyrus';
    },

    // Sanitize HTML to prevent XSS
    sanitizeHTML: function(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    // Delete account (async version to handle async hashing)
    deleteAccount: async function(password) {
        const username = this.getCurrentUser();
        if (!username) {
            return { success: false, message: 'Not logged in' };
        }

        // Cyrus cannot delete his account
        if (username === 'Cyrus') {
            return { success: false, message: 'Admin account cannot be deleted' };
        }

        const users = this.getUsers();
        const hashedPassword = await this.hashPassword(password);

        // Verify password
        if (users[username].password !== hashedPassword) {
            return { success: false, message: 'Incorrect password' };
        }

        // Delete user data
        delete users[username];
        this.saveUsers(users);

        // Clear user's app data
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(`${username}_`)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));

        // Logout
        this.clearSession();

        return { success: true, message: 'Account deleted successfully' };
    }
};

// Initialize Cyrus admin account if no users exist
window.addEventListener('load', async function initializeAdmin() {
    const users = UserAuth.getUsers();
    if (Object.keys(users).length === 0) {
        const hashedPassword = await UserAuth.hashPassword('cyrus123');
        users['Cyrus'] = {
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            role: 'admin'
        };
        UserAuth.saveUsers(users);
        console.log('Admin account created: username: Cyrus, password: cyrus123');
    }
});
