interface StatBadgeProps {
  text: string;
}

export default function StatBadge({ text }: StatBadgeProps) {
  return (
    <span className="text-xs font-bold text-green-700 bg-green-100/80 px-2.5 py-1 rounded-full shadow-sm">
      {text}
    </span>
  );
}
