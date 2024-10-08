FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG WEBHOOK_SECRET
ARG MONGODB_URL
ARG FIREBASE_API_KEY
ARG FIREBASE_AUTH_DOMAIN
ARG FIREBASE_PROJECT_ID
ARG FIREBASE_STORAGE_BUCKET
ARG FIREBASE_MESSAGING_SENDER_ID
ARG FIREBASE_APP_ID

RUN echo "NEXT_PUBLIC_CLERK_SIGN_IN_URL=${NEXT_PUBLIC_CLERK_SIGN_IN_URL}" >> .env.local \
    && echo "NEXT_PUBLIC_CLERK_SIGN_UP_URL=${NEXT_PUBLIC_CLERK_SIGN_UP_URL}" >> .env.local \
    && echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}" >> .env.local \
    && echo "CLERK_SECRET_KEY=${CLERK_SECRET_KEY}" >> .env.local \
    && echo "WEBHOOK_SECRET=${WEBHOOK_SECRET}" >> .env.local \
    && echo "MONGODB_URL=${MONGODB_URL}" >> .env.local \
    && echo "FIREBASE_API_KEY=${FIREBASE_API_KEY}" >> .env.local \
    && echo "FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}" >> .env.local \
    && echo "FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}" >> .env.local \
    && echo "FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET}" >> .env.local \
    && echo "FIREBASE_MESSAGING_SENDER_ID=${FIREBASE_MESSAGING_SENDER_ID}" >> .env.local \
    && echo "FIREBASE_APP_ID=${FIREBASE_APP_ID}" >> .env.local

RUN npm run build

EXPOSE 3000

CMD ["npm","run","start"]