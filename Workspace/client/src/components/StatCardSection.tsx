import { useQuery } from "@tanstack/react-query";
import StatCard from "./StatCard";

import { fetchStats } from "../services/product.service";

function StatCardSkeleton({ hasBadge = false }: { hasBadge?: boolean }) {
  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg flex flex-col justify-between h-36 animate-pulse">
      <div className="w-full flex justify-between items-start">
        <div className="h-10 w-16 bg-orange-900/20 rounded"></div>
        {hasBadge && (
          <div className="h-6 w-24 bg-orange-900/20 rounded-full"></div>
        )}
      </div>
      <div className="h-6 w-32 bg-orange-900/20 rounded"></div>
    </div>
  );
}

export default function StatCardSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["productStats"],
    queryFn: fetchStats,
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardSkeleton hasBadge />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="w-full max-w-5xl px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard value="-" label="Total Products" badge="- this month" />
        <StatCard value="-" label="Active Products" />
        <StatCard value="-" label="Expired Products" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        value={data.totalCount.toString()}
        label="Total Products"
        badge={`+${data.thisMonthCount} this month`}
      />
      <StatCard value={data.activeCount.toString()} label="Active Products" />
      <StatCard value={data.expiredCount.toString()} label="Expired Products" />
    </div>
  );
}
