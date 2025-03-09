#!/bin/bash

# Load environment variables from .env.production
export $(grep -v '^#' .env.production | xargs)

# Run migrations
npx drizzle-kit push

# Start the application
npm start
