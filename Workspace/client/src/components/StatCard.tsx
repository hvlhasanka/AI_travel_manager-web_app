import StatBadge from "./StatBadge";

interface StatCardProps {
  value: string | number;
  label: string;
  badge?: string;
}

export default function StatCard({ value, label, badge }: StatCardProps) {
  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg flex flex-col justify-between h-36">
      <div className="w-full flex justify-between items-start">
        <span className="text-4xl font-extrabold text-orange-900">{value}</span>
        {badge && <StatBadge text={badge} />}
      </div>
      <span className="text-orange-900/80 font-semibold text-lg uppercase tracking-wider text-left">
        {label}
      </span>
    </div>
  );
}
