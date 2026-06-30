"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser, logoutUser } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    router.push("/");
    // Force a reload to refresh all components and clean state
    window.location.reload();
  };

  return (
    <header className="border-b bg-white py-4 px-6 flex justify-between items-center shadow-sm">
      <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-800">
        Review Dibo
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Welcome, <strong>{user.name}</strong>
              {user.is_admin && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded font-semibold ml-1.5">
                  Admin
                </span>
              )}
            </span>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 font-semibold cursor-pointer border-none bg-transparent"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
            <Link href="/register" className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition">
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
