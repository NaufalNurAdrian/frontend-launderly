export default function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-EN', {
        weekday: "long",
        month: "short",
        day: "2-digit",
        year: "numeric"
    })
  }