import type { SourceDocument } from "@/types";

interface SourceCardProps {
  source: SourceDocument;
}

export function SourceCard({ source }: SourceCardProps) {
  const scorePercent = Math.round(source.score * 100);

  return (
    <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm truncate">
            {source.documentTitle}
          </h4>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {source.excerpt}
          </p>
        </div>
        <div className="flex-shrink-0">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              scorePercent >= 80
                ? "bg-green-100 text-green-800"
                : scorePercent >= 60
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {scorePercent}%
          </span>
        </div>
      </div>
    </div>
  );
}
