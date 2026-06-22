"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role !== "admin") {
        await supabase.auth.signOut();
        router.push("/login");
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Dashboard Admin</h1>
      <p className="text-gray-600">Bienvenue, {user?.email}</p>
      <button
        onClick={() => supabase.auth.signOut().then(() => router.push("/login"))}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Se déconnecter
      </button>
    </div>
  );
}
