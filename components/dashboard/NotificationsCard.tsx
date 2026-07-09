"use client";

import {
  Bell,
  AlertTriangle,
  Clock3,
  CheckCircle2,
} from "lucide-react";

interface Document {
  id: string;
  title: string;
  expiry_date: string;
}

interface Props {
  documents: Document[];
}

export default function NotificationsCard({
  documents,
}: Props) {
  const notifications = documents
    .map((doc) => {
      const diff = Math.floor(
        (new Date(doc.expiry_date).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      );

      return {
        ...doc,
        diff,
      };
    })
    .filter((doc) => doc.diff <= 30)
    .sort((a, b) => a.diff - b.diff);

  return (
    <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">

      <div className="flex items-center gap-3 mb-6">

        <Bell className="text-yellow-400" />

        <h2 className="text-2xl font-bold">
          Notificări
        </h2>

      </div>

      {notifications.length === 0 ? (

        <div className="flex items-center gap-3 text-green-400">

          <CheckCircle2 size={22} />

          <p>
            Nu există notificări.
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {notifications.map((doc) => {

            let icon = <Clock3 size={20} className="text-yellow-400" />;
            let text = `Expiră în ${doc.diff} zile`;

            if (doc.diff === 1) {
              text = "Expiră mâine";
            }

            if (doc.diff === 0) {
              text = "Expiră astăzi";
            }

            if (doc.diff < 0) {
              icon = (
                <AlertTriangle
                  size={20}
                  className="text-red-500"
                />
              );

              text = `Expirat de ${Math.abs(doc.diff)} zile`;
            }

            return (

              <div
                key={doc.id}
                className="flex items-center justify-between rounded-2xl bg-slate-800 p-4"
              >

                <div className="flex items-center gap-3">

                  {icon}

                  <div>

                    <p className="font-semibold">
                      {doc.title}
                    </p>

                    <p className="text-sm text-slate-400">
                      {text}
                    </p>

                  </div>

                </div>

              </div>

            );

          })}

        </div>

      )}

    </div>
  );
}