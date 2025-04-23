# SplitNSplit - Subscription Sharing Platform

SplitNSplit is a platform that allows users to safely and securely split subscription costs with others, saving money on their favorite services.

## Features

- User authentication (signup, login)
- Browse subscription deals by brand or category
- Join subscription splits with others
- Address and payment processing
- Email notifications and invoices
- Dashboard to manage all your subscription splits

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- Nodemailer for emails

### Frontend
- HTML5, CSS3, JavaScript
- Responsive design

## Project Structure

```
splitnsplit/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Email service
│   ├── db.js            # Database connection
│   └── server.js        # Express server
├── public/
│   ├── css/             # Stylesheets
│   ├── js/              # Frontend JavaScript
│   ├── images/          # Image assets
│   └── *.html           # HTML pages
├── .env.example         # Environment variables example
├── package.json         # Dependencies
└── README.md            # Documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository:
```
git clone https://github.com/hunter9752/splitnsplit.git
cd splitnsplit
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file based on `.env.example` and fill in your values:
```
cp .env.example .env
```

4. Start the development server:
```
npm run dev
```

5. Open your browser and navigate to `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/user` - Get user data (protected)
- `PUT /api/auth/user` - Update user profile (protected)

### Deals
- `GET /api/deals` - Get all deals
- `GET /api/deals/:id` - Get a specific deal
- `GET /api/deals/category/:category` - Get deals by category
- `POST /api/deals/join/:id` - Join a deal (protected)
- `GET /api/deals/user/joined` - Get deals joined by the user (protected)

### Brands
- `GET /api/brands` - Get all brands
- `GET /api/brands/:id` - Get a specific brand
- `GET /api/brands/:id/deals` - Get all deals for a brand
- `GET /api/brands/category/:category` - Get brands by category

### Payments
- `POST /api/payments/:dealId` - Process payment for a deal (protected)
- `GET /api/payments/user` - Get all user payments (protected)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MPL-2.0 License.

## Contact

Email: support@splitnsplit.com
