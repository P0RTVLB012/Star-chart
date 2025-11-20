# Star Chart - Personal Dashboard

A beautiful, space-themed personal dashboard application with todo lists, scheduling, notes, stopwatch, and personalized user accounts.

## Features

- **Dashboard View**: Personalized greeting with task counter
- **Todo List**: Add, complete, and delete tasks with local storage persistence
- **Schedule**: Time-based event scheduling system
- **Notes**: Create and edit multiple notes with auto-save
- **Stopwatch**: Full-featured stopwatch with start/pause functionality
- **User Authentication**: Secure login with password protection
- **Responsive Design**: Glassmorphism UI with modern aesthetics
- **Local Data Storage**: All data stored in browser's localStorage

## Getting Started

1. Clone or download the repository
2. Open `index.html` in your browser to start the application
3. Register for an account or use the default admin account:
   - Username: `Cyrus`
   - Password: `cyrus123`

## Technologies Used

- HTML5
- CSS3 (with modern features like backdrop-filter)
- JavaScript (ES6+)
- Web Crypto API for password hashing
- localStorage for data persistence

## Project Structure

```
Star-chart/
├── index.html          # Main dashboard page
├── Login.html          # Authentication page
├── user.js             # User authentication system
└── README.md           # Project documentation
```

## Deployment

This project is designed to work with GitHub Pages:
1. Push code to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Access your dashboard at `https://<username>.github.io/<repository>`

## Security

- Passwords are hashed using SHA-256 Web Crypto API
- User data is isolated by username in localStorage
- Client-side authentication (not suitable for sensitive data)

## Local Development

No build process required - simply open the HTML files in any modern browser.

## Contributing

Feel free to submit issues and enhancement requests.

## License

This project is available as-is without any warranty or specific license.
