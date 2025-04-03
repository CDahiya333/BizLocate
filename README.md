# BizLocate

A full-stack web application for discovering and connecting with local businesses. BizLocate allows users to find businesses, view their details, and locate them on a map.
## Design Mockups
<img width="1067" alt="Screenshot 2025-04-03 at 11 00 46 AM" src="https://github.com/user-attachments/assets/4b89fda7-7a41-4b5c-acd0-f1a7cc8f5681" />

## Features

- Browse and search for businesses by name or category
- View detailed business profiles with contact information
- Interactive maps showing business locations using Google Maps integration
- Admin panel for managing business listings
- Responsive design for mobile, tablet, and desktop devices
- Loading skeletons for improved user experience

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS with DaisyUI
- React Icons
- Google Maps API integration

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- Google Maps API key

### Installation

1. Clone the repository
```
git clone https://github.com/CDahiya333/BizLocate.git
cd BizLocate
```

2. Install backend dependencies
```
cd backend
npm install
```

3. Set up backend environment variables
Create a `.env` file in the backend directory with:
```
PORT=5002
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Install frontend dependencies
```
cd ../frontend
npm install
```

5. Set up frontend environment variables
Create a `.env.local` file in the frontend directory with:
```
NEXT_PUBLIC_API_URL=http://localhost:5002/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Running the Application

1. Start the backend server
```
cd backend
npm run dev
```

2. Start the frontend development server
```
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5001`

## License

MIT 
