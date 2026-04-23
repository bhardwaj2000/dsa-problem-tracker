# 🎯 DSA Problem Tracker

A comprehensive problem tracker for technical interview preparation featuring **164 hand-picked LeetCode problems** from the ItsRunTym coding sheet.

![Progress Tracking](https://img.shields.io/badge/Problems-164-blue)
![Topics](https://img.shields.io/badge/Topics-20+-green)
![Patterns](https://img.shields.io/badge/Patterns-40+-orange)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Cloud%20Sync-yellow)

## ✨ Features

- ✅ **164 Curated Problems** - Arrays, Trees, Graphs, DP, and more
- 🎯 **Pattern-Based Learning** - Each problem tagged with solving pattern
- 💡 **Efficient Java Solutions** - Interview-ready code for every problem
- 📊 **Progress Tracking** - Auto-saved status (Todo/In Progress/Done)
- 🔍 **Smart Filters** - Filter by topic, difficulty, status, and pattern
- 📱 **Responsive Design** - Works on desktop and mobile
- 🌙 **Dark Mode** - Automatic theme switching
- 🔐 **Firebase Authentication** - Secure email/password login & signup
- ☁️ **Cloud Sync** - Real-time progress sync across devices via Firestore

## 🚀 Live Demo

[**Launch Tracker →**](https://bhardwaj2000.github.io/dsa-problem-tracker/)

## 📋 Problem Coverage

| Topic | Count | Topic | Count |
|-------|-------|-------|-------|
| Arrays/String | 30 | Binary Search | 7 |
| Two Pointers | 6 | Heap | 4 |
| Sliding Window | 4 | Bit Manipulation | 6 |
| Matrix | 5 | Math | 6 |
| Linked List | 17 | 1D DP | 5 |
| Stack | 12 | Multidimensional DP | 9 |
| Recursion | 6 | Graph | 9 |
| Binary Tree | 19 | Trie | 3 |
| Backtracking | 7 | Divide & Conquer | 4 |
| Kadane's Algorithm | 2 | | |

## 🛠️ Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- A [Firebase](https://firebase.google.com/) project with **Authentication** and **Firestore Database** enabled

### Environment Variables
Create a `.env` file in the project root and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> You can find these values in your Firebase project settings.

### Run locally

```bash
# Clone the repository
git clone https://github.com/bhardwaj2000/dsa-problem-tracker.git
cd dsa-problem-tracker

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📖 How to Use

1. **Sign In** - Log in or create an account to sync your progress across devices
2. **Track Progress** - Click on any problem to expand details
3. **Update Status** - Use dropdown to mark as Todo/In Progress/Done
4. **View Solutions** - Toggle between Java solution and approach explanation
5. **Filter Problems** - Use filters to focus on specific topics or patterns
6. **Direct Links** - Click "LC →" to open problem on LeetCode

## 🎨 Patterns Covered

- Two Pointers, Sliding Window, Fast & Slow Pointers
- Monotonic Stack/Queue, BFS/DFS, Topological Sort
- Dynamic Programming (1D, 2D, State Machine)
- Binary Search, Divide & Conquer
- Floyd's Cycle Detection, Union Find
- Backtracking, Recursion, Greedy
- And 30+ more patterns!

## 💾 Data Persistence

Your progress is automatically synchronized to **Firebase Firestore** in real-time, so you can access your data from any device. An authentication layer ensures your data stays private and secure.

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 📝 Credits

Problems curated from **ItsRunTym DSA Coding Sheet**

## 📄 License

MIT License - feel free to use for your interview prep!

---

Built with ⚛️ React + ⚡ Vite + 🔥 Firebase | Made for interview success 🚀