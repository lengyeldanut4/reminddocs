import {
  FileText,
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";

export default function StatsCards({
  total,
  active,
  expired,
  expiringSoon,
}: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">

      <Card title="Total" value={total} icon={FileText} color="text-blue-400" />

      <Card title="Active" value={active} icon={CheckCircle2} color="text-green-400" />

      <Card title="Expiră curând" value={expiringSoon} icon={Clock3} color="text-yellow-400" />

      <Card title="Expirate" value={expired} icon={AlertTriangle} color="text-red-400" />

    </div>
  );
}

function Card({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500 transition">

      <div className="flex items-center justify-between">

        <p className="text-slate-400">{title}</p>

        <Icon className={color} size={20} />

      </div>

      <h2 className="text-3xl font-bold mt-3">{value}</h2>

    </div>
  );
}