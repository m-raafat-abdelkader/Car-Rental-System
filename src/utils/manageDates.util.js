import validator from "validator";



export function isValidDate(dateStr) {
  return validator.isDate(dateStr);
} 



export function createDate(dateStr) {
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 3)
  return date;
}