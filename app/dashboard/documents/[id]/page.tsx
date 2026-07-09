  "use client";

  import { useEffect, useState } from "react";
  import { useParams, useRouter } from "next/navigation";

  import { supabase } from "@/lib/supabase";

  import Sidebar from "@/components/dashboard/Sidebar";
  import Navbar from "@/components/dashboard/Navbar";

  import {
    FileText,
    CheckCircle2,
    Clock3,
    AlertTriangle,
    Save,
    Calendar,
    Folder,
  } from "lucide-react";

  interface DocumentItem {
    id: string;
    title: string;
    expiry_date: string;
    folder_id: string | null;

    file_url: string | null;
    file_name: string | null;
    file_type: string | null;
    file_path: string | null;

  }
  interface FolderItem {
    id: string;
    name: string;
  }

  export default function DocumentPage() {
    const router = useRouter();
    const params = useParams();

    const documentId = params.id as string;

    const [document, setDocument] = useState<DocumentItem | null>(null);
    const [folders, setFolders] = useState<FolderItem[]>([]);

    const [title, setTitle] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [selectedFolder, setSelectedFolder] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      loadDocument();
    }, []);

    async function loadDocument() {
      setLoading(true);

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
        .eq("id", documentId)
        .single();

      if (data?.file_path) {

    const {
      data: signedData,
    } = await supabase.storage
      .from("documents")
      .createSignedUrl(data.file_path, 60 * 60);

    data.file_url = signedData?.signedUrl || null;

  }

  setDocument(data);

  if (data) {
  setTitle(data.title);
  setExpiryDate(data.expiry_date);
  setSelectedFolder(data.folder_id || "");
}

      const { data: foldersData } = await supabase
        .from("folders")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

      setFolders(foldersData || []);

      setLoading(false);
    }

    async function saveChanges() {
      const { error } = await supabase
        .from("documents")
        .update({
          title,
          expiry_date: expiryDate,
          folder_id: selectedFolder || null,
        })
        .eq("id", documentId);

      if (error) {
        alert(error.message);
        return;
      }

      alert("Document actualizat cu succes!");
      loadDocument();
    }

    const diff = Math.floor(
      (new Date(expiryDate).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    );

    let status = "Activ";
    let color = "text-green-400";
    let Icon = CheckCircle2;

    if (diff < 0) {
      status = "Expirat";
      color = "text-red-500";
      Icon = AlertTriangle;
    } else if (diff < 30) {
      status = "Expiră curând";
      color = "text-yellow-400";
      Icon = Clock3;
    }
    return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

      <Sidebar />

      <main className="flex-1 p-10">

        <Navbar />

        {loading ? (
          <p className="text-slate-400">Se încarcă...</p>
        ) : !document ? (
          <p>Document inexistent.</p>
        ) : (

          <div className="max-w-4xl mx-auto">

            <div className="flex items-center gap-5 mb-10">

              <div className="w-20 h-20 overflow-hidden rounded-3xl bg-blue-600 flex items-center justify-center">

    {document.file_type?.startsWith("image/") ? (

      <img
        src={document.file_url || ""}
        alt={document.title}
        className="h-full w-full object-cover"
      />

    ) : (

      <FileText size={40} />

    )}

  </div>

              <div>

                <h1 className="text-4xl font-bold">
                  {title}
                </h1>

                <p className="text-slate-400 mt-2">
                  Editează informațiile documentului
                </p>

              </div>

            </div>

            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 space-y-8">

              {document.file_url && (

    <div className="rounded-2xl bg-slate-800 p-5">

      <p className="text-slate-400">
        Fișier atașat
      </p>

      <p className="mt-2 font-semibold">
        {document.file_name}
      </p>

      {document.file_type?.startsWith("image/") && (

        <img
          src={document.file_url}
          alt={document.title}
          className="mt-5 w-full rounded-2xl max-h-[420px] object-contain bg-slate-900"
        />

      )}

      <div className="mt-5 grid grid-cols-2 gap-4">

        <a
          href={document.file_url}
          target="_blank"
          className="rounded-xl bg-green-600 py-3 text-center font-semibold hover:bg-green-700 transition"
        >
          👁️ Deschide fișier
        </a>

        <a
          href={document.file_url}
          download={document.file_name || true}
          className="rounded-xl bg-slate-700 py-3 text-center font-semibold hover:bg-slate-600 transition"
        >
          ⬇️ Descarcă
        </a>

      </div>

    </div>

  )}

              <div>

                <label className="text-slate-400 mb-2 block">
                  Nume document
                </label>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3"
                />

              </div>

              <div className="grid md:grid-cols-2 gap-6">

                <div>

                  <label className="text-slate-400 mb-2 block flex items-center gap-2">
                    <Calendar size={18} />
                    Data expirării
                  </label>

                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3"
                  />

                </div>

                <div>

                  <label className="text-slate-400 mb-2 block flex items-center gap-2">
                    <Folder size={18} />
                    Folder
                  </label>

                  <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3"
                  >
                    <option value="">Fără folder</option>

                    {folders.map((folder) => (
                      <option
                        key={folder.id}
                        value={folder.id}
                      >
                        {folder.name}
                      </option>
                    ))}

                  </select>

                </div>

              </div>

              <div className="rounded-2xl bg-slate-800 p-5 flex justify-between items-center">

                <div>

                  <p className="text-slate-400">
                    Zile rămase
                  </p>

                  <p className="text-3xl font-bold mt-1">
                    {diff}
                  </p>

                </div>

                <div className={`flex items-center gap-2 font-semibold text-lg ${color}`}>
                  <Icon size={22} />
                  {status}
                </div>

              </div>
                          <button
                onClick={saveChanges}
                className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 py-4 font-semibold flex items-center justify-center gap-3 transition"
              >
                <Save size={20} />
                Salvează modificările
              </button>

            </div>

          </div>

        )}

      </main>

    </div>
  );
  }