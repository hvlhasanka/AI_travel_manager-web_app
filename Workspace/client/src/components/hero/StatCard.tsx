import StatBadge from "@/components/hero/StatBadge";

interface StatCardProps {
  value: string | number;
  label: string;
  badge?: string;
  isLabelBold?: boolean;
}

export default function StatCard({
  value,
  label,
  badge,
  isLabelBold,
}: StatCardProps) {
  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg flex flex-col justify-between h-36">
      <div className="w-full flex justify-between items-start">
        <span className="text-4xl font-extrabold text-primary-900">
          {value}
        </span>
        {badge && <StatBadge text={badge} />}
      </div>
      <span
        className={`text-primary-900/80 text-lg uppercase tracking-wider text-left ${isLabelBold ? "font-bold" : "font-semibold"}`}
      >
        {label}
      </span>
    </div>
  );
}
