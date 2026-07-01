"use client";

import {
  FileText,
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";

interface Props {
  total: number;
  active: number;
  expiringSoon: number;
  expired: number;
}

export default function StatsCards({
  total,
  active,
  expiringSoon,
  expired,
}: Props) {
  const stats = [
    {
      title: "Total documente",
      value: total,
      icon: FileText,
      color: "from-blue-600 to-cyan-500",
    },
    {
      title: "Active",
      value: active,
      icon: CheckCircle2,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Expiră curând",
      value: expiringSoon,
      icon: Clock3,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Expirate",
      value: expired,
      icon: AlertTriangle,
      color: "from-red-600 to-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 hover:scale-[1.03] hover:border-blue-600 transition duration-300"
          >
            <div
              className={`absolute top-0 right-0 w-36 h-36 rounded-full bg-gradient-to-br ${stat.color} blur-3xl opacity-20`}
            />

            <div className="flex justify-between items-start">

              <div>

                <p className="text-slate-400 text-sm">
                  {stat.title}
                </p>

                <h2 className="text-4xl font-extrabold mt-3">
                  {stat.value}
                </h2>

              </div>

              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-xl`}
              >
                <Icon size={28} className="text-white" />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}