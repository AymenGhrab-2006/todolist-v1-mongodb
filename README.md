# ToDo List — MongoDB

A simple full-stack ToDo List application built with **Node.js**, **Express**, **MongoDB**, and vanilla JavaScript. Tasks are stored in MongoDB and associated with an anonymous browser/user ID stored in a signed cookie.

## Features

- Create tasks with a title and description
- Edit existing tasks
- Mark tasks as done by deleting them
- Persist tasks in MongoDB
- Separate tasks by anonymous user/browser using a signed cookie
- Client-side validation:
  - Title: required, maximum 30 characters
  - Description: required, maximum 255 characters
- Responsive-ish UI built with Tailwind CSS utilities
- No account or login system required

## Tech Stack

- **Frontend:** HTML, vanilla JavaScript, Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Packages:** `express`, `mongodb`, `dotenv`, `cookie-parser`

## Project Structure

```text
.
├── index.html       # Main UI
├── script.js        # Frontend logic and API calls
├── input.css        # Tailwind source CSS
├── output.css       # Generated Tailwind CSS
├── server.js        # Express server and MongoDB API
├── package.json     # Node.js dependencies and scripts
├── .gitignore
└── .env             # Local secrets/configuration (DO NOT COMMIT)
```

## Requirements

Before running the project, install:

- Node.js 18+ recommended
- MongoDB running locally or a MongoDB connection string
- npm

## Installation

Clone the repository and enter the project directory:

```bash
git clone <your-repository-url>
cd <project-directory>
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://localhost:27017
COOKIE_SECRET=replace-with-a-long-random-secret
```

> Never commit your real `.env` file or expose `COOKIE_SECRET` publicly.

## Run

Start the server:

```bash
npm start
```

The application listens on:

```text
http://localhost:3000
```

Open that address in your browser.

## Database

The application automatically connects to MongoDB and uses:

- Database: `bdtask`
- Collection: `tasks`

Each task has approximately this structure:

```json
{
  "_id": "MongoDB ObjectId",
  "title": "Buy groceries",
  "description": "Milk, bread and eggs",
  "userId": "anonymous-user-id"
}
```

## API

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/task` | Get the current user's tasks |
| `POST` | `/ajout` | Create a task |
| `POST` | `/modi` | Modify a task |
| `POST` | `/del` | Delete a task |

The server automatically attaches the current anonymous `userId` to database operations.

## Security Notes

This project is suitable as a learning/personal project, but it is **not production-ready yet**.

Before deploying publicly, at minimum:

1. Use HTTPS in production.
2. Make the cookie's `secure` option environment-dependent so local HTTP development works.
3. Validate and sanitize request bodies on the server, not only in the browser.
4. Validate MongoDB ObjectIds before passing them to `ObjectId`.
5. Add appropriate security headers/rate limiting.
6. Return more precise HTTP status codes for invalid requests and missing resources.
7. Add automated tests.
8. Use a production MongoDB deployment and a restricted database user.

## Development

The project currently serves the frontend directly from the project directory with Express.

There is no automated test suite yet.

The current `npm test` command is only the default placeholder:

```bash
npm test
```

It will intentionally report that no tests are specified.

## Tailwind CSS

`output.css` is generated locally using the Tailwind CLI from `input.css`.

To rebuild the CSS during development, run your Tailwind build command.

## License

The package currently declares the **ISC** license. If you publish this project on GitHub, consider adding a `LICENSE` file containing the ISC license text.

## Status

**Learning project / v1**

The core CRUD functionality is implemented, but additional validation, testing, production configuration, and documentation can be added before treating it as production software.
