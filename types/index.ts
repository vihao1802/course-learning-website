export interface CourseParams {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor_id: string;
  poster: string;
}
export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  created_at: Date;
  instructor_id: string;
  poster: string;
  isPublished: boolean;
  lessons: string[];
}

export interface Account {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  avatar: string;
  oauth_tokes: string[];
  courses: string[];
  purchases: string[];
  lessons_progress: string[];
}

export interface Lesson {
  id: string;
  title: string;
  created_at: Date;
  position: number;
  isPublished: boolean;
  videoUrl: string;
  duration: number;
  course_id: string;
  lessons_progress: string[];
}
