import {
  FileText,
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";

interface Props {
  total: number;
  active: number;
  expired: number;
  expiringSoon: number;
}

export default function StatsCards({
  total,
  active,
  expired,
  expiringSoon,
}: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

      <Card
        title="Total documente"
        value={total}
        icon={FileText}
        color="bg-blue-600"
      />

      <Card
        title="Active"
        value={active}
        icon={CheckCircle2}
        color="bg-green-600"
      />

      <Card
        title="Expiră curând"
        value={expiringSoon}
        icon={Clock3}
        color="bg-yellow-500"
      />

      <Card
        title="Expirate"
        value={expired}
        icon={AlertTriangle}
        color="bg-red-600"
      />

    </div>
  );
}
function Card({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
}) {
  return (
    <div className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {value}
          </h2>

        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}
        >
          <Icon size={28} className="text-white" />
        </div>

      </div>

    </div>
  );
}