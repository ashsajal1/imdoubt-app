#!/bin/bash

# Load environment variables from .env.production
export $(grep -v '^#' .env.production | xargs)

# Run migrations
npx drizzle-kit push

# # Build the application
# npm run build

# # Start the application
# npm start
