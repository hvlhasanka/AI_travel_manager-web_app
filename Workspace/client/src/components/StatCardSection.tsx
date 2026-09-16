import StatCard from "./StatCard";

export default function StatCardSection() {
  return (
    <div className="w-full max-w-5xl px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard value="20" label="Total Products" badge="+8 this month" />
      <StatCard value="15" label="Active Products" />
      <StatCard value="5" label="Expired Products" />
    </div>
  );
}
