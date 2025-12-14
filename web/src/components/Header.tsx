"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isAdmin = session?.user?.role === "ADMIN";

  const navigation = isAdmin
    ? [
        { name: "ダッシュボード", href: "/admin" },
        { name: "文書管理", href: "/admin/documents" },
        { name: "監査ログ", href: "/admin/audit" },
      ]
    : [
        { name: "検索", href: "/operator" },
        { name: "履歴", href: "/operator/history" },
      ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-600">
                ナレッジ検索
              </span>
            </Link>
            <nav className="ml-10 flex space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {session?.user && (
              <>
                <span className="text-sm text-gray-600">
                  {session.user.name}
                  <span className="ml-2 px-2 py-1 text-xs bg-gray-100 rounded-full">
                    {session.user.role === "ADMIN" ? "管理者" : "担当者"}
                  </span>
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  ログアウト
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
