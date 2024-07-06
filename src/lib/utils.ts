import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// format second and not show second
export function formatSecond(second: number) {
  if (second === 0) {
    return "0 sec";
  }
  if (second < 60) {
    return `${Math.floor(second)} sec`;
  }
  const hours = Math.floor(second / 3600);
  let str = "";
  if (hours) {
    str += `${hours}h `;
    second -= hours * 3600;
  }

  const minutes = Math.floor(second / 60);
  if (minutes && second !== 0) str += `${String(minutes).padStart(2, "0")} min`;
  return str;
}

export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(dateString: Date) {
  // Parse the date string into a Date object
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

/* export function formatDurationVideo(duration: number) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  return `${hours}:${minutes}:${seconds}`;
}
 */
