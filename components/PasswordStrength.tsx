interface PasswordStrengthProps {
  password: string;
}

function getStrength(password: string): { label: string; score: number; color: string; bg: string } {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  if (password.length === 0) return { label: "", score: 0, color: "", bg: "" };
  if (score <= 1) return { label: "Weak", score: 1, color: "text-red-400", bg: "bg-red-500/30" };
  if (score === 2) return { label: "Fair", score: 2, color: "text-amber-400", bg: "bg-amber-500/30" };
  if (score === 3) return { label: "Good", score: 3, color: "text-accent", bg: "bg-accent/30" };
  return { label: "Strong", score: 4, color: "text-emerald-400", bg: "bg-emerald-500/30" };
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = getStrength(password);

  if (!strength.label) return null;

  return (
    <div className="mt-2">
      <div className="flex h-1.5 gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-full flex-1 rounded-full transition-colors ${
              level <= strength.score ? strength.bg : "bg-slate-700"
            }`}
          />
        ))}
      </div>
      <p className={`mt-1 text-xs font-medium ${strength.color}`}>
        {strength.label}
      </p>
    </div>
  );
}
