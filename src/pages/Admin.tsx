import AdminLayout, { useAdminUser } from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, List, Clock, CheckCircle, AlertTriangle, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubmissions } from "@/hooks/use-submissions";

interface BankCount {
  bank: string;
  count: number;
}

function DashboardContent() {
  const user = useAdminUser();
  const navigate = useNavigate();
  const { submissions, isLoading: loading } = useSubmissions();

  const counts = {
    total: submissions.length,
    neu: submissions.filter((s) => !s.status || s.status === "Neu").length,
    inBearbeitung: submissions.filter((s) => s.status === "In Bearbeitung").length,
    erfolgreich: submissions.filter((s) => s.status === "Erfolgreich").length,
    down: submissions.filter((s) => s.status === "Down").length,
  };

  const bankCounts: BankCount[] = (() => {
    const grouped = submissions.reduce<Record<string, number>>((acc, s) => {
      const bank = s.bank || "Unbekannt";
      acc[bank] = (acc[bank] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(grouped)
      .map(([bank, count]) => ({ bank, count }))
      .sort((a, b) => b.count - a.count);
  })();

  const stats = [
    { label: "Gesamt", value: counts.total, icon: FileText, color: "text-slate-600", bg: "bg-slate-100" },
    { label: "Neu", value: counts.neu, icon: List, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "In Bearbeitung", value: counts.inBearbeitung, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Erfolgreich", value: counts.erfolgreich, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Down", value: counts.down, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Willkommen, {user.email}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="cursor-pointer border-slate-200 shadow-sm transition-shadow hover:shadow-md rounded-xl"
            onClick={() => navigate("/admin/logs")}
          >
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{loading ? "–" : stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Banken</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <p className="text-sm text-slate-400">Laden...</p>
          ) : bankCounts.length > 0 ? (
            bankCounts.map((bc) => (
              <Card
                key={bc.bank}
                className="cursor-pointer border-slate-200 shadow-sm transition-shadow hover:shadow-md rounded-xl"
                onClick={() => navigate("/admin/logs")}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                    <Building2 className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-bold text-slate-900">{bc.count}</p>
                    <p className="text-xs text-slate-500 truncate">{bc.bank}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-sm text-slate-400">Keine Daten</p>
          )}
        </div>
      </div>
    </div>
  );
}

const Admin = () => (
  <AdminLayout>
    <DashboardContent />
  </AdminLayout>
);

export default Admin;
