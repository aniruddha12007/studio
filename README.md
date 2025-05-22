# Personal Finance Manager

This is a Next.js application that helps you manage your personal finances. It allows you to track your transactions, create budgets, and get insights into your spending habits. It also includes an AI assistant to help you with your financial planning.

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-repository-name.git
   cd your-repository-name
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up Firebase:**
   - Create a Firebase project at https://console.firebase.google.com/.
   - Add a web app to your Firebase project.
   - Copy your Firebase configuration object and paste it into a new `.env.local` file in the root of the project, like this:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
     ```
   - Enable Firestore and Authentication in your Firebase project.
4. **Run the development server:**
   ```bash
   npm run dev
   ```
   This will start the Next.js development server, usually on http://localhost:9002.
5. **Run the Genkit AI flows (optional):**
   If you want to use the AI assistant features, you'll also need to run the Genkit AI flows:
   ```bash
   npm run genkit:dev
   ```

## Project Structure

Here's a brief overview of the main directories in this project:

- **`src/app`**: Contains the main application code, including pages and layouts.
- **`src/components`**: Contains reusable UI components.
- **`src/lib`**: Contains utility functions and Firebase configuration.
- **`src/ai`**: Contains the Genkit AI flows and related code.
- **`docs`**: Contains additional documentation, like the blueprint for the AI assistant.
- **`public`**: Contains static assets like images and fonts.

## Available Scripts

In the project directory, you can run the following scripts:

- **`npm run dev`**: Runs the Next.js development server with Turbopack.
- **`npm run genkit:dev`**: Starts the Genkit development server.
- **`npm run genkit:watch`**: Starts the Genkit development server in watch mode.
- **`npm run build`**: Builds the application for production.
- **`npm run start`**: Starts the production server.
- **`npm run lint`**: Lints the code using Next.js's built-in ESLint configuration.
- **`npm run typecheck`**: Runs TypeScript to check for type errors.

## Contributing

Contributions are welcome! If you have any ideas for improvements or new features, feel free to open an issue or submit a pull request.
