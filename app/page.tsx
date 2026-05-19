import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
          <svg
            className="h-6 w-6 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          SecureGate
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-slate-400">
          A focused authentication layer built for production. Identity and
          access management, done right.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[#020617]"
          >
            Create Account
          </Link>

          <Link
            href="/login"
            className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-[#020617]"
          >
            Sign In
          </Link>
        </div>
      </div>

      <footer className="mt-20 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} SecureGate
      </footer>
    </div>
  );
}
