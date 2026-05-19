import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  if (!user || !user.emailVerified) {
    redirect("/login?error=unverified");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="rounded-xl border border-slate-800 bg-surface p-8 shadow-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Welcome, {user.name ?? "User"}
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                You are signed in and verified.
              </p>
            </div>
            <LogoutButton />
          </div>

          <div className="mt-8 border-t border-slate-800 pt-6">
            <h2 className="text-lg font-semibold text-white">
              Account details
            </h2>

            <dl className="mt-4 divide-y divide-slate-800">
              <div className="flex items-center justify-between py-3">
                <dt className="text-sm text-slate-400">Email</dt>
                <dd className="text-sm font-medium text-slate-200">
                  {user.email}
                </dd>
              </div>

              <div className="flex items-center justify-between py-3">
                <dt className="text-sm text-slate-400">Status</dt>
                <dd>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Verified
                  </span>
                </dd>
              </div>

              <div className="flex items-center justify-between py-3">
                <dt className="text-sm text-slate-400">Member since</dt>
                <dd className="text-sm font-medium text-slate-200">
                  {user.createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </dd>
              </div>
            </dl>
          </div>

          <p className="mt-8 text-center text-xs text-slate-600">
            This page is only accessible to verified, authenticated users.
          </p>
        </div>
      </div>
    </div>
  );
}
