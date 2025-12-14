"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import type { Inquiry, SourceDocument } from "@/types";

interface InquiryWithSources extends Omit<Inquiry, "sourceDocs"> {
  sourceDocs: SourceDocument[] | null;
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<InquiryWithSources[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchHistory();
    }
  }, [session]);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/search/history");
      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries || []);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">検索履歴</h1>

        {inquiries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              検索履歴がありません
            </h2>
            <p className="text-gray-600">
              検索を行うと、ここに履歴が表示されます。
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {inquiry.question}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(inquiry.createdAt).toLocaleString("ja-JP")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {inquiry.feedback && (
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          inquiry.feedback === "HELPFUL"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {inquiry.feedback === "HELPFUL"
                          ? "役に立った"
                          : "役に立たなかった"}
                      </span>
                    )}
                    {inquiry.responseTimeMs && (
                      <span className="text-xs text-gray-500">
                        {inquiry.responseTimeMs}ms
                      </span>
                    )}
                  </div>
                </div>
                {inquiry.aiResponse && (
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                    <p className="line-clamp-3">{inquiry.aiResponse}</p>
                  </div>
                )}
                {inquiry.sourceDocs && inquiry.sourceDocs.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {inquiry.sourceDocs.map((source, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                      >
                        {source.documentTitle}
                      </span>
                    ))}
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
