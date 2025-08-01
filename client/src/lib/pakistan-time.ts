// Pakistan Time Utility Functions
// Pakistan Standard Time is GMT+5

export function getPakistanTime(): Date {
  // Create a new Date object and adjust for Pakistan time (GMT+5)
  const utcTime = new Date();
  const pakistanTime = new Date(utcTime.getTime() + (5 * 60 * 60 * 1000));
  return pakistanTime;
}

export function getPakistanTimeString(): string {
  // Get current Pakistan time as ISO string
  return getPakistanTime().toISOString();
}

export function getPakistanDateString(): string {
  // Get current Pakistan date as YYYY-MM-DD string
  return getPakistanTime().toISOString().split('T')[0];
}

export function formatPakistanDate(dateOffset: number = 0): Date {
  // Get Pakistan time with optional date offset
  const pakistanTime = getPakistanTime();
  pakistanTime.setDate(pakistanTime.getDate() + dateOffset);
  return pakistanTime;
}

export function formatPakistanDateString(dateOffset: number = 0): string {
  // Get Pakistan date string with optional date offset
  const pakistanDate = formatPakistanDate(dateOffset);
  return pakistanDate.toISOString().split('T')[0];
}

export function isPastTimePakistan(dateTimeString: string): boolean {
  // Check if a given datetime string is in the past according to Pakistan time
  const inputTime = new Date(dateTimeString);
  const pakistanNow = getPakistanTime();
  return inputTime < pakistanNow;
}

export function formatPakistanTimeSlot(dateString: string, timeString: string): Date {
  // Create a Pakistan time slot from date and time strings
  const pakistanDateTime = new Date(`${dateString}T${timeString}`);
  return pakistanDateTime;
}