import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function logRealtime(message: string, x?: any) {
  console.log(`%c[Realtime] ${message}`, "color: #ff009d", x);
}
