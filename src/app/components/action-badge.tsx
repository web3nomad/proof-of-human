export function ActionBadge({
  action,
  size = "sm",
}: {
  action: string;
  size?: "sm" | "md";
}) {
  const cooperative = action === "split" || action === "cooperate";
  const sizeClass = size === "md" ? "text-sm px-2.5 py-1" : "text-xs px-2 py-0.5";
  return (
    <span
      className={`inline-block font-mono rounded ${sizeClass} ${
        cooperative ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {action}
    </span>
  );
}
