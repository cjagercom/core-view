import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  period: number;
  onPeriodChange: (days: number) => void;
}

export function DashboardLayout({ children, period, onPeriodChange }: DashboardLayoutProps) {
  return (
    <div className="min-h-dvh bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Core-View Admin</h1>
            <p className="text-sm text-gray-500">Analytics Dashboard</p>
          </div>
          <div className="flex gap-2">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => onPeriodChange(days)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  period === days ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid gap-6">{children}</div>
      </main>
    </div>
  );
}
