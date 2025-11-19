#  Flashcard App

A modern, full-stack web application for creating, managing, and mastering flashcards using interactive review modes. Built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

## Features

### Core Functionality
- **User Authentication**: Secure registration and login with bcrypt password hashing
- **Folder Management**: Organize flashcards into folders
- **Multi-folder Review**: Select multiple folders for study sessions
- **Two Review Modes**:
  - **Swipe Mode**: Flip cards with tap/space, swipe with J/L keys (wrong/memorized)
  - **Typing Mode**: Type answers to test recall accuracy
- **Smart Card Tracking**:
  - Track card status: `new`, `memorized`, `not-memorized`
  - Auto-wrong on timeout
  - Persistent wrong card history

### Advanced Features

- **Keyboard Shortcuts**: J=wrong, L=memorized, Space=flip, P=pause
- **Timer-Based Review**: Automatic timeout and card progression
- **Not Memorized Queue**: Quick access to cards needing review
- **Responsive Design**: Works on desktop, tablet, and mobile
`

##  Getting Started

### Prerequisites
- **Node.js** (v16+)
- **MongoDB** (local or cloud instance, e.g., MongoDB Atlas)
- **npm** or **yarn**

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/disha-bose-8/FLASHCARD-APP-PROJECT.git
cd FLASHCARD-APP-PROJECT
```

#### 2. Setup Frontend
```bash
npm install
```

#### 3. Setup Backend
```bash
cd backend
npm install
```

#### 4. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/flashcard-db
PORT=5000
```

#### 5. Run the Application

**Terminal 1 - Backend (port 5000):**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend (port 5173):**
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

##  API Endpoints

### Authentication
- `POST /api/users/register` - Create new account
- `POST /api/users/login` - Login user
- `PUT /api/users/update-email` - Update email
- `PUT /api/users/update-password` - Change password

### Folders
- `POST /api/folders/create` - Create new folder
- `GET /api/folders/:userId` - Get all user folders
- `DELETE /api/folders/:folderId` - Delete folder

### Flashcards
- `POST /api/flashcards/add` - Add card to folder
- `PUT /api/flashcards/status` - Update card status (new/memorized/not-memorized)
- `PUT /api/flashcards/update` - Edit card content
- `PUT /api/flashcards/delete` - Remove card
- `POST /api/flashcards/import` - Bulk import cards
- `GET /api/flashcards/not-memorized/:userId` - Get cards marked as "not-memorized"








##  Troubleshooting

### Cards show as "wrong" but won't update
- **Solution**: Run the migration script to convert old "wrong" statuses to "not-memorized":
  ```bash
  cd backend
  node migrate-wrong-to-not-memorized.js
  ```

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check `API` variable in files (should be `http://localhost:5000/api`)
- Verify CORS is enabled in `server.js`

### MongoDB connection fails
- Verify `MONGODB_URI` in `.env` is correct
- Check MongoDB Atlas firewall rules if using cloud
- Ensure database name matches in connection string

#### Thank you