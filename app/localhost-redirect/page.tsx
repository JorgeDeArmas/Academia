import { redirect } from "next/navigation";

export default function LocalhostRedirect() {
  // If accessed via localhost in production/dev, redirect to proper domain
  const properDomain =
    process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI?.split("/api")[0];

  if (properDomain) {
    redirect(`${properDomain}/dashboard`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-md p-8 bg-white rounded-2xl shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">
          🎉 Login Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          You're logged in, but you're accessing via localhost which doesn't
          support HTTPS.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-semibold text-blue-900 mb-2">
            Access your dashboard at:
          </p>
          <a
            href={`${properDomain}/dashboard`}
            className="text-blue-600 hover:text-blue-800 underline break-all"
          >
            {properDomain}/dashboard
          </a>
        </div>
        <p className="text-xs text-gray-500">
          💡 Tip: Always use the ngrok URL for testing OAuth flows
        </p>
      </div>
    </div>
  );
}
