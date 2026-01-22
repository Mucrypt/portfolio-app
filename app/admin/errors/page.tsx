"use client";

import { useState, useEffect } from "react";

interface ErrorLog {
  id: string;
  timestamp: string;
  level: "error" | "warning" | "info";
  message: string;
  stack?: string;
  url?: string;
  user?: string;
  browser?: string;
}

export default function ErrorLogsPage() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [filter, setFilter] = useState<"all" | "error" | "warning" | "info">("all");
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);

  useEffect(() => {
    // Simulate fetching error logs (replace with actual API)
    const mockErrors: ErrorLog[] = [
      {
        id: "1",
        timestamp: new Date().toISOString(),
        level: "error",
        message: "Failed to fetch blog posts",
        stack: "Error: getaddrinfo ENOTFOUND\n  at Server.ts:45\n  at async fetch()",
        url: "/blog",
        browser: "Chrome 120",
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        level: "warning",
        message: "Slow query detected (>500ms)",
        url: "/services",
        browser: "Safari 17",
      },
      {
        id: "3",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        level: "info",
        message: "User logged in successfully",
        user: "admin@example.com",
      },
    ];
    setErrors(mockErrors);
  }, []);

  const filteredErrors = filter === "all" ? errors : errors.filter((e) => e.level === filter);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "error":
        return "🔴";
      case "warning":
        return "🟡";
      case "info":
        return "🔵";
      default:
        return "⚪";
    }
  };

  return (
    <div className="p-8 max-w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Error Logs & Monitoring</h1>
        <p className="text-gray-600">Track and debug application errors in real-time</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Total Logs</div>
          <div className="text-3xl font-bold text-gray-900">{errors.length}</div>
        </div>
        <div className="bg-red-50 p-6 rounded-lg shadow-sm border border-red-200">
          <div className="text-sm text-red-600 mb-1">Errors</div>
          <div className="text-3xl font-bold text-red-900">
            {errors.filter((e) => e.level === "error").length}
          </div>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-200">
          <div className="text-sm text-yellow-600 mb-1">Warnings</div>
          <div className="text-3xl font-bold text-yellow-900">
            {errors.filter((e) => e.level === "warning").length}
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-200">
          <div className="text-sm text-blue-600 mb-1">Info</div>
          <div className="text-3xl font-bold text-blue-900">
            {errors.filter((e) => e.level === "info").length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex gap-3">
        {["all", "error", "warning", "info"].map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level as any)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === level
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      {/* Error List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Logs</h2>
          <div className="space-y-3">
            {filteredErrors.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-2">✨</div>
                <p>No {filter !== "all" ? filter + " " : ""}logs found</p>
              </div>
            ) : (
              filteredErrors.map((error) => (
                <div
                  key={error.id}
                  onClick={() => setSelectedError(error)}
                  className={`p-4 rounded-lg border-2 cursor-pointer hover:shadow-md transition ${getLevelColor(
                    error.level
                  )}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">{getLevelBadge(error.level)}</span>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 mb-1">{error.message}</div>
                        <div className="text-sm text-gray-600 space-y-1">
                          {error.url && <div>📍 URL: {error.url}</div>}
                          {error.user && <div>👤 User: {error.user}</div>}
                          {error.browser && <div>🌐 Browser: {error.browser}</div>}
                          <div>🕐 {new Date(error.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Error Detail Modal */}
      {selectedError && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedError(null)}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Error Details</h2>
                <button
                  onClick={() => setSelectedError(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Level</label>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getLevelColor(selectedError.level)}`}>
                  {selectedError.level.toUpperCase()}
                </span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <p className="text-gray-900">{selectedError.message}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Timestamp</label>
                <p className="text-gray-900">{new Date(selectedError.timestamp).toLocaleString()}</p>
              </div>
              {selectedError.stack && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stack Trace</label>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    {selectedError.stack}
                  </pre>
                </div>
              )}
              {selectedError.url && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">URL</label>
                  <p className="text-gray-900">{selectedError.url}</p>
                </div>
              )}
              {selectedError.browser && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Browser</label>
                  <p className="text-gray-900">{selectedError.browser}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
