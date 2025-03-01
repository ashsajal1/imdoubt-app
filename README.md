# ImDoubt App

ImDoubt is a doubt-sharing application that allows users to post their doubts and receive reactions from other users. Users can mark doubts as "right" or "wrong" based on their understanding.

## Features

- User authentication and authorization
- Post doubts with content
- React to doubts with "right" or "wrong"
- View counts of "right" and "wrong" reactions for each doubt
- Real-time updates for reactions

## Project Structure

```
imdoubt-app/
├── src/
│   ├── actions/
│   │   └── doubt-reaction.ts
│   ├── components/
│   │   └── doubt-card.tsx
│   ├── db/
│   │   ├── drizzle.ts
│   │   └── schema.ts
│   └── pages/
│       └── index.tsx
├── public/
│   └── ...
├── styles/
│   └── ...
├── .env
├── .gitignore
├── README.md
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- pnpm
- PostgreSQL

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ashsajal1/imdoubt-app.git
cd imdoubt-app
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

Create a .env file in the root directory and add the following variables:

```env
DATABASE_URL=your_database_url
CLERK_API_KEY=your_clerk_api_key
```

4. Run database migrations:

```bash
npx drizzle-kit push
```

### Running the App

Start the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Sign up or log in using the authentication system.
2. Post a doubt by providing the content.
3. React to doubts by marking them as "right" or "wrong".
4. View the counts of "right" and "wrong" reactions for each doubt.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
