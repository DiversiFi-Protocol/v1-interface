# v1-interface

## DiversiFi Protocol Official Frontend

## Requirements

- Node.js v18.17.0 or later
- pnpm (Package Manager)

## Setup

1. Install Node Version Manager (NVM):

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

   or visit [NVM Installation Guide](https://github.com/nvm-sh/nvm#installing-and-updating) for more options.

2. Install and use the correct Node.js version:

   ```bash
   nvm install 20.18.3
   nvm use
   ```

3. Install pnpm globally:

   ```bash
   npm install -g pnpm
   ```

4. Install project dependencies:
   ```bash
   pnpm install
   ```

## Development

1. Install dependencies (if you haven't already):

   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

The development server will start at `http://localhost:5173` (or another port if 5173 is in use).
