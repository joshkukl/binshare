# BinShare

A secure, burn-after-reading file transfer utility built for developers. Share sensitive documents, API keys, and environment variables without leaving a digital footprint.

## Features

* **End-to-End Secure:** Files are encrypted and stored securely using MongoDB GridFS.
* **Burn After Reading:** One-time-use links ensure the database record and file are permanently wiped the moment they are accessed.
* **Temporary Drop Zone:** Files not saved to the personal vault are automatically purged after 24 hours via a self-configuring TTL database index.
* **Personal Vault:** A secure, authenticated dashboard to manage long-term encrypted files.

## Tech Stack

* **Frontend:** Next.js (App Router), Tailwind CSS, Material UI (MUI)
* **Backend:** Next.js API Routes, Node.js
* **Database:** MongoDB (Mongoose & GridFS)

## Getting Started

Follow these instructions to run the project locally. The application is designed to automatically configure its own database indexes upon the first connection.

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/binshare-csc543.git
cd binshare-csc543
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Setup
Create a `.env.local` file in the root directory of the project and add your MongoDB connection string and a NextAuth secret. 
*(Note: The application will automatically create the required `binshare.files` collections and the 24-hour TTL index upon first connection).*

```env
# Your MongoDB connection string
MONGODB_URI=your_mongodb_connection_string_here

# Required for NextAuth to encrypt session cookies. 
# For local testing, any random string will work.
NEXTAUTH_SECRET=super_secret_random_string_for_testing
NEXTAUTH_URL=http://localhost:3000

### 4. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.
