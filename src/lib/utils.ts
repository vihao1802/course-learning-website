import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// format second and not show second
export function formatSecond(second: number) {
  console.log("second: ", second);

  if (second === 0) {
    return "0 min";
  } else if (second < 0) {
    return "1 min";
  }
  const hours = Math.floor(second / 3600);
  const minutes = Math.floor((second % 3600) / 60);
  // const seconds = second % 60;
  let str = "";
  if (hours) str += `${hours}h `;
  if (minutes) str += `${minutes >= 10 ? minutes : "0" + minutes} min`;
  return str;
}

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
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
