export interface ICourseParams {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor_id: string;
  poster: string;
}
export interface ICourse {
  _id: string;
  id: string;
  title: string;
  description: string;
  price: number;
  created_at: Date;
  instructor_id: IAccount;
  poster: string;
  isPublished: boolean;
  lessons: ILesson[];
}

export interface IAccount {
  _id: string;
  id: string;
  name: string;
  email: string;
  created_at: Date;
  avatar: string;
  oauth_tokes: string[];
  courses: ICourse[];
  purchases: string[];
  lessons_progress: ILessonProgress[];
}

export interface ILesson {
  _id: string;
  id: string;
  title: string;
  created_at: Date;
  position: number;
  isPublished: boolean;
  // videoUrl: string;
  video: IVideo;
  // duration: number;
  course_id: string;
  lessons_progress: ILessonProgress[];
  // lessonProgress: LessonProgress[];
}

export interface IVideo {
  id: string;
  videoUrl: string;
  duration: number;
}

export interface ILessonProgress {
  id: string;
  lesson_id: string;
  account_id: string;
  isCompleted: boolean;
}
