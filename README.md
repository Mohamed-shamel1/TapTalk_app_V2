<div align="">
  <img src="./FE/src/assets/Logo.png" width="400" height="400" />

  # **TapTalk**
  ### Connect. Chat. Communicate. Real-Time. 💬✨

  **Live Demo:** https://tap-talk-app-v2.vercel.app/
</div>

---

## 📑 Table of Contents

- [About The Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Socket.IO Features](#-socketio-features)
- [API Endpoints](#-api-endpoints)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Conversations](#conversations)
  - [Messages](#messages)
  - [AI Chat](#ai-chat)
- [Screenshots](#-screenshots)
- [Installation & Run](#-installation--run)
- [Environment Variables](#-environment-variables)
- [Folder Structure](#-folder-structure)
- [Contributing & License](#-contributing--license)

---

## 🎯 About The Project

**TapTalk** is a cutting-edge, production-grade real-time chat application that revolutionizes the way people communicate. Built with modern web technologies, TapTalk offers seamless instant messaging, multimedia sharing, and intelligent AI-powered conversations.

### Key Highlights:

🚀 **Real-Time Communication**: Experience lightning-fast messaging with Socket.IO, ensuring messages are delivered instantly across all connected devices.

💾 **Robust Backend**: Powered by Node.js and Express, with MongoDB as the database, providing scalable and reliable data management.

🎨 **Modern UI/UX**: Beautiful, responsive React frontend that adapts to any screen size, delivering an exceptional user experience on desktop, tablet, and mobile devices.

🤖 **AI Integration**: Advanced AI chat capabilities powered by Google Gemini, enabling intelligent conversations and assistance.

🔐 **Enterprise-Grade Security**: JWT authentication, email verification, OTP-based password recovery, and Google OAuth integration for secure access.

📱 **Rich Messaging**: Support for text messages, images, file sharing, message deletion, read receipts, typing indicators, and online/offline status tracking.

---

## ✨ Features

### 🔄 Real-Time Features
- ✅ **Real-time messaging** using Socket.IO
- ✅ **Seen / Delivered** message status tracking
- ✅ **Online/Offline** user state indicators
- ✅ **Typing indicators** for active conversations
- ✅ **Instant notifications** for new messages

### 💬 Messaging
- ✅ **Text messaging** with rich formatting
- ✅ **File & image sharing** (up to 5 images per message)
- ✅ **Message deletion** (for sender and receiver)
- ✅ **Message read receipts** with timestamps
- ✅ **Conversation management** (view, delete conversations)

### 🔐 Authentication & Security
- ✅ **JWT Authentication** with refresh tokens
- ✅ **Email verification** with OTP
- ✅ **Google Sign-In** integration
- ✅ **Forget Password** with OTP-based reset
- ✅ **Secure password hashing** with bcrypt
- ✅ **Account freezing/unfreezing** (admin feature)

### 👥 User Management
- ✅ **User profiles** with customizable avatars
- ✅ **Contact management** (add/remove friends)
- ✅ **User search** functionality
- ✅ **Profile sharing** (public profiles)
- ✅ **Cover picture** support

### 🤖 AI Features
- ✅ **AI-powered chat** using Google Gemini
- ✅ **Conversation history** persistence
- ✅ **Context-aware responses**
- ✅ **Real-time AI typing indicators**

### 🎨 UI/UX
- ✅ **Modern responsive UI** built with React
- ✅ **Dark/Light theme** support
- ✅ **Smooth animations** with Lottie
- ✅ **404 error pages** with animations
- ✅ **Loading indicators** and states
- ✅ **Responsive design** for all devices

---

## 🛠 Tech Stack

### **Frontend**
| Technology | Purpose |
|------------|---------|
| **React 19** | UI library for building interactive user interfaces |
| **Vite** | Next-generation frontend build tool |
| **React Router DOM** | Client-side routing |
| **Socket.IO Client** | Real-time communication |
| **Axios** | HTTP client for API requests |
| **React OAuth Google** | Google authentication integration |
| **Lottie React** | Animation library |
| **Lucide React** | Icon library |
| **FontAwesome** | Additional icon support |

### **Backend**
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web application framework |
| **Socket.IO** | Real-time bidirectional event-based communication |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB object modeling |
| **JWT** | JSON Web Tokens for authentication |
| **Bcrypt** | Password hashing |
| **Nodemailer** | Email service |
| **Cloudinary** | Cloud-based image storage |
| **Multer** | File upload handling |
| **Google Gemini AI** | AI chat integration |
| **Swagger** | API documentation |
| **Helmet** | Security middleware |
| **CORS** | Cross-origin resource sharing |
| **Express Rate Limit** | Rate limiting middleware |

### **DevOps & Tools**
- **Git** - Version control
- **ESLint** - Code linting
- **Vercel** - Frontend deployment
- **Swagger UI** - API documentation

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            React Frontend (Vite)                     │   │
│  │  • UI Components  • State Management  • Routing      │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/REST API
                        │ WebSocket (Socket.IO)
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                      SERVER LAYER                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Node.js + Express.js Backend                 │   │
│  │  • REST API Endpoints  • Authentication  • Business  │   │
│  │    Logic  • File Upload  • Email Service             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Socket.IO Server                        │   │
│  │  • Real-time Messaging  • Typing Indicators          │   │
│  │    • Online/Offline Status  • Read Receipts          │   │
│  │    • AI Chat Integration                             │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Data Storage
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                      DATA LAYER                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              MongoDB Database                        │   │
│  │  • Users  • Messages  • Conversations  • Tokens      │   │
│  │    • AI Conversations                                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Cloudinary (File Storage)                 │   │
│  │  • Images  • Media Files                             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                        │
│  • Google OAuth  • Google Gemini AI  • Email Service        │
└─────────────────────────────────────────────────────────────┘
```

### **Architecture Flow:**

1. **Client Request**: User interacts with React frontend
2. **API Gateway**: Express.js handles HTTP requests
3. **Authentication**: JWT middleware validates requests
4. **Business Logic**: Controllers and services process data
5. **Data Layer**: MongoDB stores and retrieves data
6. **Real-Time**: Socket.IO handles instant messaging
7. **External Services**: Integration with Google OAuth, Gemini AI, and Email

---

## 🔌 Socket.IO Features

TapTalk uses Socket.IO for real-time bidirectional communication. Here are the key events and their functionality:

### **Connection Events**

#### **Client → Server Events**

| Event | Description | Payload |
|-------|-------------|---------|
| `joinRoom` | Join a user's room for receiving messages | `{ userId: string }` |
| `typing` | Indicate user is typing | `{ receiverId: string }` |
| `stopTyping` | Indicate user stopped typing | `{ receiverId: string }` |
| `message-readed` | Mark messages as read | `{ massagesIds: string[], senderId: string }` |
| `aiSendMessage` | Send message to AI chat | `{ message: string, userId: string }` |

#### **Server → Client Events**

| Event | Description | Payload |
|-------|-------------|---------|
| `typing` | Receive typing indicator | - |
| `stopTyping` | Receive stop typing indicator | - |
| `message-readed` | Receive read receipt confirmation | `massagesIds: string[]` |
| `newAiMessage` | Receive AI response | `{ reply: string }` |
| `aiTyping` | AI is typing indicator | - |
| `aiTypingStop` | AI stopped typing | - |
| `aiError` | AI error occurred | `{ error: string }` |

### **Code Examples**

#### **Client-Side (React)**

```javascript
import { socket } from './services/socketIo.service.js';

// Join user room
socket.emit('joinRoom', userId);

// Send typing indicator
socket.emit('typing', { receiverId: 'user123' });

// Stop typing indicator
socket.emit('stopTyping', { receiverId: 'user123' });

// Mark messages as read
socket.emit('message-readed', {
  massagesIds: ['msg1', 'msg2'],
  senderId: 'sender123'
});

// Listen for typing indicators
socket.on('typing', () => {
  setTypingStatus(true);
});

socket.on('stopTyping', () => {
  setTypingStatus(false);
});

// Listen for read receipts
socket.on('message-readed', (massagesIds) => {
  updateMessageStatus(massagesIds, 'read');
});

// AI Chat
socket.emit('aiSendMessage', {
  message: 'Hello AI!',
  userId: 'user123'
});

socket.on('newAiMessage', ({ reply }) => {
  addAiMessage(reply);
});
```

#### **Server-Side (Node.js)**

```javascript
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join room
  socket.on('joinRoom', (userId) => {
    socket.join(userId);
  });
  
  // Typing indicators
  socket.on('typing', ({ receiverId }) => {
    socket.to(receiverId).emit('typing');
  });
  
  // Read receipts
  socket.on('message-readed', async ({ massagesIds, senderId }) => {
    await updateMessagesAsRead(massagesIds);
    socket.to(senderId).emit('message-readed', massagesIds);
  });
  
  // AI Chat
  socket.on('aiSendMessage', async ({ message, userId }) => {
    socket.emit('aiTyping');
    const reply = await generateAIResponse(message, userId);
    socket.emit('aiTypingStop');
    socket.emit('newAiMessage', { reply });
  });
});
```

---

## 📡 API Endpoints

### **Base URL**
```
Backend: http://localhost:3000
Frontend: http://localhost:5173
```

### **Authentication**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | User login | ❌ |
| `POST` | `/api/auth/confirm-email` | Verify email with OTP | ❌ |
| `POST` | `/api/auth/resend-otp` | Resend OTP code | ❌ |
| `POST` | `/api/auth/forgot-password` | Request password reset OTP | ❌ |
| `POST` | `/api/auth/reset-password` | Reset password with OTP | ❌ |
| `POST` | `/api/auth/google-signup` | Google OAuth signup/login | ❌ |
| `POST` | `/api/auth/refresh-token` | Refresh access token | ❌ |

#### **Request Examples**

**Register**
```json
POST /api/auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "12345678901",
  "gender": "male"
}
```

**Login**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Confirm Email**
```json
POST /api/auth/confirm-email
{
  "email": "john@example.com",
  "otp": "123456"
}
```

---

### **Users**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/user/profile` | Get current user profile | ✅ |
| `GET` | `/api/user/profile/:userId` | Get shared user profile | ❌ |
| `PATCH` | `/api/user/profile` | Update user profile | ✅ |
| `PATCH` | `/api/user/password` | Update password | ✅ |
| `PATCH` | `/api/user/profile-image` | Update profile image | ✅ |
| `PATCH` | `/api/user/cover-picture` | Update cover picture | ✅ |
| `POST` | `/api/user/add-friend` | Add friend/contact | ✅ |
| `POST` | `/api/user/remove-friend` | Remove friend/contact | ✅ |
| `GET` | `/api/user/contacts` | Get user contacts | ✅ |
| `GET` | `/api/user/search` | Search users | ✅ |
| `POST` | `/api/user/logout` | User logout | ✅ |
| `DELETE` | `/api/user/delete-account` | Delete user account | ✅ |

---

### **Conversations**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/message/conversations` | Get all conversations | ✅ |
| `DELETE` | `/api/message/conversations/:receiverId` | Delete conversation | ✅ |

---

### **Messages**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/message/:receiverId/senderId` | Send message (with images) | ✅ |
| `GET` | `/api/message/chats` | Get all messages | ✅ |
| `GET` | `/api/message/:id` | Get message by ID | ✅ |
| `GET` | `/api/message/chat/:otherUserId` | Get messages with user | ✅ |
| `DELETE` | `/api/message/:id` | Delete message | ✅ |

#### **Send Message Example**

```javascript
POST /api/message/:receiverId/senderId
Content-Type: multipart/form-data

{
  "content": "Hello!",
  "images": [File, File] // Max 5 images
}
```

---

### **AI Chat**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/ai/conversation` | Get AI conversation history | ✅ |
| `DELETE` | `/api/ai/conversation` | Delete AI conversation | ✅ |

> **Note**: AI chat primarily uses Socket.IO events (`aiSendMessage`, `newAiMessage`)

---

## 📸 Screenshots

### **Login Page**
![Login Page](./screenshots/login.png)

### **Chat Window**
![Chat Window](./screenshots/chat.png)

### **Contacts**
![Contacts](./screenshots/contacts.png)

### **AI Chat**
![AI Chat](./screenshots/ai-chat.png)

### **Profile Settings**
![Profile Settings](./screenshots/settings.png)

---

## 🚀 Installation & Run

### **Prerequisites**

- Node.js (v22.17.0 or higher)
- MongoDB (local or cloud instance)
- npm or yarn
- Google OAuth credentials (for Google Sign-In)
- Cloudinary account (for image storage)
- Google Gemini API key (for AI chat)
- Email service credentials (for email verification)

### **Backend Setup**

1. **Navigate to backend directory**
```bash
cd TapTalk_app_V1
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
# Copy the environment variables template (see Environment Variables section)
```

4. **Start the server**
```bash
npm start
```

The backend server will run on `http://localhost:3000`

### **Frontend Setup**

1. **Navigate to frontend directory**
```bash
cd FE
```

2. **Install dependencies**
```bash
npm install
```

3. **Update configuration**
```bash
# Update config.js with your backend URL
```

4. **Start the development server**
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### **Build for Production**

**Frontend**
```bash
cd FE
npm run build
```

**Backend**
```bash
cd TapTalk_app_V1
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file in the `TapTalk_app_V1` directory with the following variables:

```env
# Server Configuration
PORT=3000

# Database
MONGO_URI=mongodb://localhost:27017/taptalk
# Or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/taptalk

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here

# Client URL (Frontend)
CLIENT_URL=http://localhost:5173

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Service (Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google Gemini AI
GEMINI_API_KEY=your-google-gemini-api-key
```

### **How to Get Credentials**

1. **MongoDB**: 
   - Local: Install MongoDB locally
   - Cloud: Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Cloudinary**: 
   - Sign up at [Cloudinary](https://cloudinary.com)
   - Get credentials from dashboard

3. **Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials

4. **Google Gemini API**:
   - Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

5. **Email Service**:
   - For Gmail: Use App Password (2FA required)
   - Or use services like SendGrid, Mailgun

---

## 📁 Folder Structure

```
SARAHAA.app/
│
├── FE/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── assets/             # Images, logos, animations
│   │   ├── components/         # React components
│   │   │   ├── ChatWindow/    # Chat interface components
│   │   │   ├── ContactsListModal/
│   │   │   ├── ConversationsPanel/
│   │   │   ├── NavSidebar/
│   │   │   └── settinges/
│   │   ├── context/           # React context (Theme)
│   │   ├── pages/             # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── AIChatPage.jsx
│   │   ├── services/          # API services
│   │   │   ├── API.js
│   │   │   ├── auth.js
│   │   │   ├── socketIo.service.js
│   │   │   └── userService.js
│   │   └── style/             # CSS files
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── TapTalk_app_V1/            # Backend (Node.js + Express)
│   ├── src/
│   │   ├── DB/                # Database connection
│   │   │   └── connection.js
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.middleware.js
│   │   │   └── validation.js
│   │   ├── model/             # Mongoose models
│   │   │   ├── user.model.js
│   │   │   ├── Massage.model.js
│   │   │   ├── Token.model.js
│   │   │   └── AIConversation.model.js
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/          # Authentication
│   │   │   │   ├── auth.controller.js
│   │   │   │   └── auth.service.js
│   │   │   ├── user/          # User management
│   │   │   │   ├── user.controller.js
│   │   │   │   └── user.service.js
│   │   │   ├── massage/       # Messaging
│   │   │   │   ├── massage.controller.js
│   │   │   │   └── massage.service.js
│   │   │   └── ai/            # AI chat
│   │   │       ├── ai.controller.js
│   │   │       └── ai.service.js
│   │   ├── utils/             # Utility functions
│   │   │   ├── security/      # JWT, hashing, encryption
│   │   │   ├── multier/       # File upload (Multer)
│   │   │   ├── email.js       # Email service
│   │   │   └── swagger.js     # API documentation
│   │   ├── validation/        # Input validation schemas
│   │   │   ├── auth.validation.js
│   │   │   ├── user.validation.js
│   │   │   └── massage.validation.js
│   │   ├── uploads/           # Local file uploads
│   │   ├── app.controller.js  # Main app setup
│   │   └── index.js           # Entry point
│   ├── package.json
│   └── .env                   # Environment variables
│
└── README.md                  # This file
```

---

## 🤝 Contributing

We welcome contributions to TapTalk! Here's how you can help:

### **Contributing Guidelines**

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### **Code Style**

- Follow ESLint rules
- Write clear, readable code
- Add comments for complex logic
- Update documentation for new features
- Write tests for new functionality

### **Reporting Issues**

If you find a bug or have a feature request, please open an issue on GitHub with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

**TapTalk Development Team**

- **Mohamed Shamel** - *Initial work* - [GitHub](https://github.com/mohamed-shamel1)

---

## 🙏 Acknowledgments

- **Socket.IO** - Real-time communication
- **Google Gemini** - AI chat capabilities
- **React Team** - Amazing UI library
- **MongoDB** - Robust database solution
- **Cloudinary** - Image storage service
- **Vercel** - Hosting platform

---

## 📞 Contact & Support

For questions, support, or feedback:

- **Email**: mshamel460@gmail.com
- **GitHub Issues**: [Open an issue](https://github.com/mohamed-shmel1/taptalk/issues)
- **Documentation**: Check `/api-docs` endpoint for Swagger API documentation

---

<div align="center">
  
  **Made with ❤️ by the TapTalk Team**
  
  ⭐ **Star this repo if you find it helpful!** ⭐
  
</div>

