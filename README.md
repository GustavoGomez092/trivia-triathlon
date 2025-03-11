# React.js Trivia Triathlon App

Welcome to the **Trivia Triathlon**, a fast-paced, multiplayer trivia game that merges cognitive challenges with the competitive spirit of a triathlon. Players race through three sports-themed stages—running, swimming, and cycling—by completing rapid-fire puzzles and quick-thinking tasks. The top competitors then face off in an archery-themed finale to determine the ultimate champion.

## Table of Contents

1. [Overview](#overview)  
2. [Core Components](#core-components)  
3. [Game Stages](#game-stages)  
4. [Technical Implementation](#technical-implementation)  
5. [Key Features](#key-features)  
6. [Data Structure](#data-structure)  
7. [Development Phases](#development-phases)  
8. [Getting Started](#getting-started)  
9. [License](#license)

---

## Overview

In this innovative trivia-meets-sports challenge, each player controls a unique character sprite through:

1. **Running Stage** – Test typing speed and reflexes.  
2. **Swimming Stage** – Solve word and pattern puzzles.  
3. **Cycling Stage** – Tackle math and logic challenges.

Throughout the game, Firebase’s real-time capabilities keep every participant’s progression visible on a shared leaderboard, fostering a truly competitive and immersive experience.

---

## Core Components

- **Authentication System**: Utilizes Firebase Authentication for secure user registration and login.  
- **Real-time Database**: Employs Firebase Realtime Database to synchronize game state and player progress.  
- **Main Game UI**: A React.js interface that displays all participants’ character sprites and progress.  
- **Participant Interface**: Each player interacts with an individual interface to complete challenges.

---

## Game Stages

1. **Running Stage**  
   - Speed typing challenges  
   - Rapid-fire key pressing mini-games  
   - Multiple-choice questions with time penalties  

2. **Swimming Stage**  
   - Word unscrambling puzzles  
   - Pattern recognition games  
   - Sequence memory challenges  

3. **Cycling Stage**  
   - Mathematical puzzles  
   - Logic problems  
   - Quick reflex challenges  


---

## Technical Implementation

### Frontend (React.js)

- **React Router** for navigation between different stages (running, swimming, cycling, archery).  
- **Zustand** for state management to efficiently store and update player progress and challenges.  
- **Custom Animations** to animate character sprites and visually indicate advancement.  
- **Real-time Updates** to display live progression in the triathlon race.

### Backend (Firebase)

- **Firebase Authentication** to manage user sign-up, login, and session handling.  
- **Firebase Realtime Database** for broadcasting updates, syncing scores, and maintaining game state.  
- **Leaderboard Management** to track and display top-performing players.  
- **Game State Persistence** so players reconnecting can resume where they left off.

---

## Key Features

- **Real-time Participant Tracking**: See every racer’s position updated in real-time.  
- **Interactive Challenge System**: Engage with a variety of trivia and puzzle mini-games.  
- **Dynamic Leaderboard**: Watch leaderboard positions change live as players complete challenges.  
- **Animated Character Progression**: Vibrant sprites that move across running, swimming, and cycling tracks.  
- **Multi-stage Competition Flow**: Progress across multiple sports-themed segments before a final showdown.

---

## Data Structure

Below is a simplified outline of how data might be stored in the Firebase Realtime Database:

```jsx
{
  participants: {
    userId: {
      name: String,
      avatar: String,
      currentStage: Number,
      score: Number,
      position: {
        x: Number,
        y: Number
      }
    }
  },
  gameState: {
    currentStage: String,
    activeParticipants: Number,
    challenges: Array,
    leaderboard: Array
  }
}
```

- `participants` stores individual player details (name, avatar, score, etc.).
- `gameState` centralizes information about the current stage, challenges, and leaderboard.

---

## Development Phases

1. **Authentication and User Management Setup**  
2. **Core Game Mechanics Implementation**  
3. **Real-time Synchronization System**  
4. **Challenge Creation and Management**  
5. **Sprite Animation and Movement System**  
6. **Leaderboard and Scoring Mechanism**  
7. **Final Challenge (Archery) Implementation**  
8. **Testing and Optimization**

---

## Getting Started

### Prerequisites
- **Node.js** (>= 22.x)  
- **npm**
- A **Firebase** project with Authentication and Realtime Database enabled.

### Installation and Setup

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/your-username/trivia-triathlon.git
   ```
2. **Install Dependencies**  
   ```bash
   cd trivia-triathlon
   npm install
   ```
3. **Configure Firebase**  
   - Create a `.env` file or update your configuration with your Firebase project’s keys (API key, auth domain, database URL, etc.).  
   - Example:
     ```env
      REACT_PUBLIC_FIREBASE_API_KEY= lorem-ipsum-12345
      REACT_PUBLIC_FIREBASE_AUTH_DOMAIN= lorem-ipsum-12345.firebaseapp.com
      REACT_PUBLIC_FIREBASE_PROJECT_ID= lorem-ipsum-12345
      REACT_PUBLIC_FIREBASE_STORAGE_BUCKET= lorem-ipsum-12345.appspot.com
      REACT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID= 1234567890
      REACT_PUBLIC_FIREBASE_APP_ID= 1:1234567890:web:1234567890
     ```
4. **Run the App**  
   ```bash
   npm start
   ```
   The app should now be available at [http://localhost:3000](http://localhost:3000).

---

## License

This project is licensed under the [MIT License](LICENSE). Feel free to modify and distribute as needed for your own trivia triathlon adventures!

---

**Enjoy the race!** May the quickest minds and fingers dominate the Trivia Triathlon. Pull requests and issue submissions are always welcome to help make this experience even more engaging and thrilling.