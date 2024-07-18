<h1 align="center">Course Learning Website</h1>
<p align="center">A fullstack website for creating, enrolling and learning course through uploaded video.</p>

<div align="center">
    <a href="https://github.com/vihao1802/course-learning-website/pulls">
        <img src="https://img.shields.io/github/issues-pr-closed/vihao1802/course-learning-website"
        alt="Pull Requests Badge"
         />
    </a>
    <a href="https://github.com/vihao1802/course-learning-website/graphs/contributors">
        <img src="https://img.shields.io/github/contributors/vihao1802/course-learning-website"
        alt="Contributors Badge"
         />
    </a>
    <!-- <a href="https://github.com/vihao1802/awesome-README-templates/blob/master/LICENSE"><img src="https://img.shields.io/github/license/elangosundar/awesome-README-templates?color=2b9348" alt="License Badge"/></a> -->
</div>

## About the project

### Tech stack

- FE + BE: **_Nextjs, Reactjs, typescript, tailwinds CSS_**
- UI components: **Shadcn**
- OAuth: **Clerk**
- Database: **MongoDB, mongoose**
- Storage: **Firebase Storage**
- Unit Test: **Jest**
- CI/CD: **github action, docker**

### Features

- Sign Up/Sign In with OAuth(Google/Github/etc.)
- List all courses and lessons of the course
- Enroll course and watching course video
- Mark as Completed/Uncompleted lessons
- Show progress bar of the course
- Creating/Editing course
- Uploading poster(.jpg/.png/etc.) for each courses
- Adding/Editing lessons of the course
- Uploading video(.mp4) for each lessons

### Database Diagram

Link: [Course-Learning-Database-Diagram](https://drawsql.app/teams/team-project-2/diagrams/course-learning)

## Getting started

### Prerequisites

- node >= 18
- npm(comes with node)
- docker

### Installation

<ol>
  <li>
    <p>
        In `root` directory, install all dependencies in `package.json`
    </p>
    ``` 
    npm i
    ```
  </li>
  <li>
    <p>
        In `root` directory, create `.env.local` file with the content shown below
    </p>
    ```
        NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
        NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
        CLERK_SECRET_KEY=

        MONGODB_URL=your-url-to-mongdb-database-cloud

        FIREBASE_API_KEY=
        FIREBASE_AUTH_DOMAIN=
        FIREBASE_PROJECT_ID=
        FIREBASE_STORAGE_BUCKET=
        FIREBASE_MESSAGING_SENDER_ID=
        FIREBASE_APP_ID=
    ```

  </li>
  <li>
    <p>
        Run the app
    </p>
    ``` 
    npm run dev
    ```
  </li>
</ol>
