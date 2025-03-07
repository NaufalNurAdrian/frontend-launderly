
export default function formatId(number: number | undefined | null, length: number = 3): string {
  if (number === undefined || number === null) {
    return "0".padStart(length, "0");
  }

  return number.toString().padStart(length, "0");
}