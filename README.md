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
- Home

![image](https://github.com/user-attachments/assets/d5cbd635-44c6-4588-854c-0db5f866f5cb)

- Course Learning

![Screenshot 2024-12-01 161453](https://github.com/user-attachments/assets/0c2c6a71-cfca-4d77-9b03-e5eeae36faca)

- Course List Management

![Screenshot 2024-12-01 161518](https://github.com/user-attachments/assets/b7ce5c24-6101-446e-8848-298672c5d8a9)


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

- Manually

In `root` directory, install all dependencies in `package.json`

```
npm i
```

In `root` directory, create `.env.local` file with the content was shown below

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

Run the app

```
npm run dev
```

- Docker hub

```
docker pull namelessh/course-learning-website:latest
```

```
docker run -dp 3001:3000 namelessh/course-learning-website
```
