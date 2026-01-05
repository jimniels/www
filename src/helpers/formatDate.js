export default function formatDate(dateString) {
  const d = new Date(dateString);
  const formatted = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return formatted;
}
