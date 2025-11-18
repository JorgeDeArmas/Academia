"use client";

import { useRouter } from "next/navigation";
import TikTokCreatorProfile from "./TikTokCreatorProfile";

interface CreatorCardProps {
  user_id: string;
  unique_id: string;
  nickname: string;
  avatar_url: string;
  signature: string;
  region: string;
  category: string;
  total_followers_cnt: number;
  total_video_cnt: number;
  total_sale_gmv_30d_amt: number;
  interaction_rate: number;
  ec_score: number;
}

const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${amount.toFixed(2)}`;
};

export default function CreatorCard({
  user_id,
  unique_id,
  category,
  total_sale_gmv_30d_amt,
  interaction_rate,
  ec_score,
}: CreatorCardProps) {
  const router = useRouter();

  const handleMetricsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/creators/${user_id}`);
  };

  // Dynamic color based on engagement rate
  const getEngagementColor = (rate: number) => {
    const percentage = rate * 100;
    if (percentage < 2) return "text-red-600";
    if (percentage >= 2 && percentage <= 5) return "text-orange-500";
    return "text-green-600";
  };

  // Dynamic color based on EC score
  const getScoreColor = (score: number) => {
    if (score < 2) return "text-red-600";
    if (score >= 2 && score <= 5) return "text-orange-500";
    return "text-green-600";
  };

  return (
    <div className="group space-y-2">
      {/* TikTok Creator Profile Embed - Display as-is */}
      <div className="w-full">
        <TikTokCreatorProfile username={unique_id} />
      </div>

      {/* Metrics Bar - Separate card matching TikTok embed style */}
      <div 
        onClick={handleMetricsClick}
        className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
      >
        <div className="flex items-center justify-between gap-3">
          {/* Category Badge */}
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-[#FF0050] text-white shadow-sm">
              {category}
            </span>
          </div>

          {/* Metrics Row */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            {/* GMV 30d */}
            <div className="text-center">
              <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">GMV 30D</div>
              <div className="text-sm font-bold text-emerald-600">{formatCurrency(total_sale_gmv_30d_amt)}</div>
            </div>

            {/* Engagement */}
            <div className="text-center">
              <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">ENGAGEMENT</div>
              <div className={`text-sm font-bold ${getEngagementColor(interaction_rate)}`}>{(interaction_rate * 100).toFixed(1)}%</div>
            </div>

            {/* EC Score */}
            <div className="text-center">
              <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">SCORE</div>
              <div className={`text-sm font-bold ${getScoreColor(ec_score)}`}>
                {ec_score.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
