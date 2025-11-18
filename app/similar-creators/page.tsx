"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreatorCard from "@/components/CreatorCard";

interface Creator {
  id: string;
  user_id: string;
  unique_id: string;
  nickname: string;
  avatar_url: string;
  signature?: string;
  category: string;
  region: string;
  total_followers_cnt: number;
  total_sale_gmv_30d_amt: number;
  ec_score: number;
  interaction_rate: number;
  total_video_cnt: number;
}

export default function SimilarCreatorsPage() {
  const router = useRouter();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState<string>("Beauty");
  const pageSize = 10;

  // Fetch creators
  const fetchCreators = async (pageNum: number) => {
    try {
      setLoading(true);
      setError(null);

      const url = new URL("/api/similar-creators", window.location.origin);
      url.searchParams.set("page", pageNum.toString());
      url.searchParams.set("pageSize", pageSize.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setCreators(data.creators);
      setTotalPages(data.totalPages);
      setCurrentPage(pageNum);
      if (data.filters?.category) {
        setCategory(data.filters.category);
      }
    } catch (err) {
      console.error("Error fetching creators:", err);
      setError(
        err instanceof Error ? err.message : "Error al cargar creadores"
      );
    } finally {
      setLoading(false);
    }
  };

  // Load creators on mount
  useEffect(() => {
    fetchCreators(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    fetchCreators(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && creators.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00F2EA] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Cargando creadores similares...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Creadores Similares
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {category} • ES • US
                {creators.length > 0 && (
                  <span className="ml-2">({creators.length} creadores)</span>
                )}
              </p>
            </div>

            {/* Back to Dashboard */}
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00F2EA] to-[#00D9D0] text-gray-900 rounded-lg hover:from-[#00D9D0] hover:to-[#00F2EA] font-semibold transition-all shadow-md"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Creators Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {creators.length === 0 && !loading ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No se encontraron creadores
            </h2>
            <p className="text-gray-500">
              No hay creadores disponibles en este momento
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creators.map((creator) => (
                <CreatorCard
                  key={creator.id}
                  user_id={creator.user_id}
                  unique_id={creator.unique_id}
                  nickname={creator.nickname}
                  avatar_url={creator.avatar_url}
                  signature={creator.signature || ""}
                  region={creator.region}
                  category={creator.category}
                  total_followers_cnt={creator.total_followers_cnt}
                  total_video_cnt={creator.total_video_cnt}
                  total_sale_gmv_30d_amt={creator.total_sale_gmv_30d_amt}
                  interaction_rate={creator.interaction_rate}
                  ec_score={creator.ec_score}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium">
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages || loading}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

