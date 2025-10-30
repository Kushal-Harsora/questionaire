# 🧠 Questionaire — Marketing Insights Form

A simple Next.js 14 project that helps users answer marketing-related questions, saves their responses, and emails them a personalized summary.

## 🚀 Features

🏠 Two pages

``` bash
/ → Home page (start or login)
/questions → Marketing questionnaire (protected route)
```

## 🔐 JWT Authentication

Users cannot access /questions without a valid JWT token.

### 🧾 Interactive MCQ-style questionnaire

Users answer marketing-related questions with hints and multiple-choice options.

Includes “Next”, “Previous”, and “Hint” buttons for smooth navigation.

### ✉️ Email submission

Upon completion, the user’s responses are sent to their registered email.

### ⚡ Middleware protection

Ensures /questions is accessible only when a valid JWT token is set via cookies.

### 🎨 Modern UI

Built using Tailwind CSS and Shadcn/UI components.

### 🧩 Tech Stack

Next.js 14 (App Router)

TypeScript

Tailwind CSS

Shadcn/UI

JWT (jsonwebtoken)

Nodemailer (for email sending)

📂 Project Structure

```
questionaire/
├── app/
│   ├── page.tsx                 # Home page ('/')
│   ├── questions/
│   │   └── page.tsx             # Questionnaire page ('/questions')
│   │── api/
│   │   └── auth/
│   │       └── route.ts         # API endpoint to handle login
│   └── data/
│           └── route.ts         # API endpoint to handle submit
├── proxy.ts                # JWT-based route protection (middleware)
├── components/                  # UI components (Card, Button, Dialog, etc.)
├── package.json
└── README.md
```

### ⚙️ Environment Variables

Create a .env.local file in the project root with the following keys:

```
DOMAIN=<Frontend_URL>
APP_NAME=<Name_of_Website>
JWT_SECRET=<secret_phrase>
EMAIL_ID=<email_id_for_smtp>
EMAIL_PASSWORD=<email_id_password>
```


💡 For Gmail users, use a Google App Password, not your regular password.
Create one here
.


### 🧠 Questionnaire Page (/questions)

Displays multiple-choice questions related to marketing.

Provides hints via a 💡 button.

Allows navigation through Next and Previous buttons.

At the end, shows an Answer Summary and triggers an email via API.

### 📦 Installation & Setup
#### Clone repository

``` bash
git clone https://github.com/Kushal-Harsora/questionaire.git
```

#### Navigate into project

```
cd questionaire
```

#### Install dependencies

```
npm install
```

#### Run the app

```
npm run dev
```
Visit 👉 http://localhost:3000

## 👨‍💻 Author

- [@KushalHarsora](https://github.com/KushalHarsora)