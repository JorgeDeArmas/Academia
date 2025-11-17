"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SimilarCreatorWithDetails, VideoWithProducts } from "@/types";
import { formatCurrency } from "@/lib/translators/productAdapter";
import { calculateEngagementScore } from "@/lib/utils/culturalFit";
import { TikTokEmbed } from "@/components/TikTokEmbed";
import { TikTokProfileEmbed } from "@/components/TikTokProfileEmbed";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [similarCreators, setSimilarCreators] = useState<
    SimilarCreatorWithDetails[]
  >([]);
  const [expandedCreator, setExpandedCreator] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/");
          return;
        }
        throw new Error("Failed to fetch dashboard data");
      }
      const data = await response.json();
      setUser(data.user);
      setSimilarCreators(data.similarCreators);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const toggleCreator = (creatorId: string) => {
    setExpandedCreator(expandedCreator === creatorId ? null : creatorId);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-purple-600">Academia</h1>
              {user && (
                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.display_name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        // Hide image on error
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-lg">
                        {user.display_name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {user.display_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user.creator_category}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Creadores Similares a Ti
          </h2>
          <p className="text-gray-600">
            Descubre qué están haciendo creadores en tu nicho y aprende de su
            éxito
          </p>
        </div>

        {similarCreators.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No encontramos creadores similares aún
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Estamos analizando la plataforma para encontrar los mejores
              matches para ti. Vuelve pronto para ver tus recomendaciones.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {similarCreators.map((creator) => (
              <div
                key={creator.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Creator Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => toggleCreator(creator.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {creator.avatar_url ? (
                        <img
                          src={creator.avatar_url}
                          alt={creator.display_name}
                          className="w-16 h-16 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
                          <span className="text-pink-600 font-semibold text-2xl">
                            {creator.display_name?.charAt(0).toUpperCase() ||
                              "C"}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {creator.display_name}
                        </h3>
                        <p className="text-gray-600">@{creator.username}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                            {creator.creator_category}
                          </span>
                          <span className="text-sm text-gray-500">
                            {creator.similarity_score}% similar
                          </span>
                          <a
                            href={`https://www.tiktok.com/@${creator.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                            </svg>
                            Ver perfil
                          </a>
                        </div>
                      </div>
                    </div>
                    <svg
                      className={`w-6 h-6 text-gray-400 transition-transform ${
                        expandedCreator === creator.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Expanded Content: Videos */}
                {expandedCreator === creator.id && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Videos Más Exitosos
                    </h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {creator.top_videos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function VideoCard({ video }: { video: any }) {
  const [showProducts, setShowProducts] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const engagementScore = calculateEngagementScore(
    video.view_count,
    video.like_count,
    video.comment_count,
    video.share_count
  );

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
        {/* Video Thumbnail */}
        <div 
          className="relative aspect-[9/16] bg-gray-200 cursor-pointer group"
          onClick={() => setShowEmbed(true)}
        >
          {video.cover_image_url ? (
            <img
              src={video.cover_image_url}
              alt={video.title || "TikTok video"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
              <svg className="w-16 h-16 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </div>
          )}
          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition flex items-center justify-center">
            <div className="bg-white rounded-full p-4 group-hover:scale-110 transition">
              <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
            {formatNumber(video.view_count)} views
          </div>
        </div>

      {/* Video Info */}
      <div className="p-4">
        <h5 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {video.title}
        </h5>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-900">
              {formatNumber(video.like_count)}
            </div>
            <div className="text-xs text-gray-500">❤️ Likes</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-900">
              {formatNumber(video.comment_count)}
            </div>
            <div className="text-xs text-gray-500">💬 Comentarios</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-900">
              {formatNumber(video.share_count)}
            </div>
            <div className="text-xs text-gray-500">🔗 Shares</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-purple-600 font-medium">
            {engagementScore}% engagement
          </span>
        </div>

        {/* Products Toggle */}
        {video.products && video.products.length > 0 && (
          <>
            <button
              onClick={() => setShowProducts(!showProducts)}
              className="w-full text-sm text-purple-600 hover:text-purple-700 font-medium border-t border-gray-200 pt-3 flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {showProducts ? "Ocultar" : "Ver"} Productos (
              {video.products.length})
            </button>

            {showProducts && (
              <div className="mt-3 space-y-3">
                {video.products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>

    {/* TikTok Embed Modal */}
    {showEmbed && (
      <div 
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={() => setShowEmbed(false)}
      >
        <div 
          className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => setShowEmbed(false)}
            className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* TikTok Embed */}
          <div className="max-h-[80vh] overflow-y-auto">
            {video.video_url ? (
              <TikTokEmbed 
                videoUrl={video.video_url} 
                videoId={video.video_id}
                className="mx-auto"
              />
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">URL del video no disponible</p>
                <button
                  onClick={() => setShowEmbed(false)}
                  className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-200 rounded">
        <Image
          src={product.product_image_url}
          alt={product.product_name}
          fill
          className="object-cover rounded"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h6 className="font-medium text-gray-900 text-sm line-clamp-1">
          {product.product_name}
        </h6>
        <p className="text-lg font-bold text-purple-600">
          {formatCurrency(product.price, product.currency)}
        </p>
        {product.sales_count && (
          <p className="text-xs text-gray-500">
            {product.sales_count} ventas
            {product.conversion_rate && (
              <> · {(product.conversion_rate * 100).toFixed(1)}% conversión</>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
