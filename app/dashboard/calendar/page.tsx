"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import roLocale from "@fullcalendar/core/locales/ro";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  color: string;

  expiry_date: string;
  file_url: string | null;
  file_type: string | null;
  folder_id: string | null;
}

export default function CalendarPage() {
  const router = useRouter();

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] =
  useState<CalendarEvent | null>(null);

const [popupOpen, setPopupOpen] =
  useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id);

    if (!data) return;

    const { data: foldersData } = await supabase
  .from("folders")
  .select("id,name")
  .eq("user_id", user.id);

setFolders(foldersData || []);

    const calendarEvents = data.map((doc) => {
      const diff =
        (new Date(doc.expiry_date).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24);

      let color = "#22c55e";

      if (diff < 0) {
        color = "#ef4444";
      } else if (diff < 30) {
        color = "#facc15";
      }

     return {
  id: doc.id,
  title: doc.title,
  date: doc.expiry_date,
  color,

  expiry_date: doc.expiry_date,
  file_url: doc.file_url,
  file_type: doc.file_type,
  folder_id: doc.folder_id,
};
    });
console.log(calendarEvents);

    setEvents(calendarEvents);
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

      <Sidebar />

      <main className="flex-1 p-10">

        <Navbar />

        <h1 className="text-3xl font-bold mb-8">
          Calendar expirări
        </h1>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">

          <FullCalendar
  plugins={[dayGridPlugin, interactionPlugin]}
  locale={roLocale}
  initialView="dayGridMonth"
  firstDay={1}
  height="auto"
  headerToolbar={{
    left: "prev,next today",
    center: "title",
    right: "",
  }}
  buttonText={{
    today: "Astăzi",
  }}
  events={events}
  eventClick={(info) => {

  const event = events.find(
    (e) => e.id === info.event.id
  );

  if (!event) return;

  setSelectedEvent(event);
  setPopupOpen(true);

}}
/>

        </div>

      </main>
     {popupOpen && selectedEvent && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

  <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-8">

    <h2 className="text-2xl font-bold">
      {selectedEvent.title}
    </h2>

    <p className="mt-3 text-slate-400">
      Expiră:
    </p>

    <p className="font-semibold">
      {selectedEvent.expiry_date}
    </p>

    {selectedEvent.file_type?.startsWith("image/") && (

      <img
        src={selectedEvent.file_url || ""}
        alt={selectedEvent.title}
        className="mt-6 w-full rounded-2xl max-h-80 object-contain bg-slate-800"
      />

    )}

    <div className="mt-5 rounded-2xl bg-slate-800 p-4 space-y-3">

      <div className="flex justify-between">

        <span className="text-slate-400">
          Status
        </span>

        <span
          className={`font-bold ${
            (() => {
              const diff =
                (new Date(selectedEvent.expiry_date).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24);

              if (diff < 0) return "text-red-500";
              if (diff < 30) return "text-yellow-400";
              return "text-green-400";
            })()
          }`}
        >
          {(() => {
            const diff =
              (new Date(selectedEvent.expiry_date).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24);

            if (diff < 0) return "Expirat";
            if (diff < 30) return "Expiră curând";
            return "Activ";
          })()}
        </span>

      </div>

      <div className="flex justify-between">

        <span className="text-slate-400">
          Zile rămase
        </span>

        <span className="font-semibold">
          {Math.floor(
            (new Date(selectedEvent.expiry_date).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
          )}
        </span>

      </div>

      <div className="flex justify-between">

        <span className="text-slate-400">
          Folder
        </span>

        <span>
          {folders.find(
            (f) => f.id === selectedEvent.folder_id
          )?.name || "Fără folder"}
        </span>

      </div>

    </div>

    <div className="mt-8 flex gap-4">

      <button
        onClick={() =>
          router.push(`/dashboard/documents/${selectedEvent.id}`)
        }
        className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-700 transition"
      >
        Deschide document
      </button>

      <button
        onClick={() => setPopupOpen(false)}
        className="flex-1 rounded-xl bg-slate-700 py-3 font-semibold hover:bg-slate-600 transition"
      >
        Închide
      </button>

    </div>

  </div>

</div>

)}

    </div>
  );
}