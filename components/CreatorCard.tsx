"use client";

import { useRouter } from "next/navigation";
import TikTokCreatorProfile from "./TikTokCreatorProfile";
import { useI18n } from "@/lib/i18n";

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
  ec_score?: number;
}

const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${Math.round(amount)}`;
};

export default function CreatorCard({
  user_id,
  unique_id,
  category,
  total_sale_gmv_30d_amt,
  interaction_rate,
}: CreatorCardProps) {
  const router = useRouter();
  const { t } = useI18n();

  const handleCardClick = () => {
    router.push(`/creators/${user_id}`);
  };

  // Dynamic color based on engagement rate
  const getEngagementColor = (rate: number) => {
    const percentage = rate * 100;
    if (percentage < 2) return "text-red-600";
    if (percentage >= 2 && percentage <= 5) return "text-orange-500";
    return "text-green-600";
  };

  return (
    <div className="group cursor-pointer w-full max-w-[340px] mx-auto relative">
      {/* TikTok Creator Profile Embed */}
      <div className="w-full">
        <TikTokCreatorProfile username={unique_id} maxWidth="100%" />
      </div>

      {/* Overlay Metrics - Top Right */}
      <div
        className="absolute top-5 right-5 flex flex-col items-end z-10"
        onClick={(e) => {
          e.stopPropagation();
          handleCardClick();
        }}
      >
        {/* Category Badge */}
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-[#FF0050] text-white shadow-sm mb-7 mt-1">
          {category}
        </span>

        {/* Metrics Container */}
        <div className="flex flex-col items-end gap-2">
          {/* GMV 30D */}
          <div className="flex flex-col items-end">
            <span className="text-base font-bold text-gray-900 leading-none">
              {formatCurrency(Number(total_sale_gmv_30d_amt))}
            </span>
            <span className="text-[10px] text-gray-500 font-medium leading-tight mt-2">
              GMV 30d
            </span>
          </div>

          {/* Engagement */}
          <div className="flex flex-col items-end">
            <span
              className={`text-base font-bold leading-none ${getEngagementColor(
                interaction_rate
              )}`}
            >
              {Math.round(interaction_rate * 100)}%
            </span>
            <span className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">
              Engagement
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
