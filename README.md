# Moderate Jokes Service

## Setup Instructions

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration

5. Run development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build production version
- `npm start`: Run production server
- `npm run lint`: Run ESLint
- `npm test`: Run tests

## Environment Variables

The following environment variables are required:

- `PORT`: Server port (default: 3002)
- `JWT_SECRET`: Secret key for JWT tokens
- `DELIVER_JOKES_URL`: URL of the Deliver Jokes service
- `SUBMIT_JOKES_URL`: URL of the Submit Jokes service
- `ADMIN_EMAIL`: Admin email for authentication
- `ADMIN_PASSWORD`: Admin password for authentication
