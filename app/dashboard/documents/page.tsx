"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import AddDocumentDialog from "@/components/dashboard/AddDocumentDialog";
import DocumentCard from "@/components/dashboard/DocumentCard";

import {
  Search,
  FileText,
} from "lucide-react";


interface Document {
  id: string;
  title: string;
  expiry_date: string;
  folder_id: string | null;
  created_at: string;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  file_path: string | null;
}

interface FolderItem {
  id: string;
  name: string;
}


export default function DocumentsPage() {

  const router = useRouter();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    checkUser();
    loadDocuments();

  }, []);



  async function checkUser() {

    const {
      data,
    } = await supabase.auth.getUser();


    if (!data.user) {
      router.replace("/login");
    }

  }



  async function loadDocuments() {

    setLoading(true);


    const {
      data: {
        user,
      },
    } = await supabase.auth.getUser();


    if (!user) return;



    const [
      { data: docs },
      { data: folderData },
    ] = await Promise.all([

      supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        }),


      supabase
        .from("folders")
        .select("id,name")
        .eq("user_id", user.id)
        .order("name"),

    ]);


    const docsWithUrls = await Promise.all(

  (docs || []).map(async (doc) => {

    if (!doc.file_path) return doc;

    const {
      data: signedData,
    } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.file_path, 60 * 60);

    return {
      ...doc,
      file_url: signedData?.signedUrl || null,
    };

  })

);

setDocuments(docsWithUrls);
    setFolders(folderData || []);

    setLoading(false);

  }
    async function deleteDocument(doc: Document) {

  if (!confirm("Ștergi documentul?")) return;

  // Șterge fișierul din Storage
  if (doc.file_url) {

    const url = new URL(doc.file_url);

    const path = decodeURIComponent(
      url.pathname.split("/object/sign/documents/")[1]?.split("?")[0] ||
      url.pathname.split("/object/public/documents/")[1]
    );

    if (path) {
      await supabase.storage
        .from("documents")
        .remove([path]);
    }

  }

  // Șterge documentul din baza de date
  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", doc.id);

  if (error) {
    alert(error.message);
    return;
  }

  loadDocuments();
}



  const filtered = documents.filter((doc) =>
    doc.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );



  return (

    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">


      <Sidebar />


      <main className="flex-1 p-10">


        <Navbar />


        <div className="flex items-center justify-between mb-8">


          <div>

            <h1 className="text-3xl font-bold">
              Documentele mele
            </h1>


            <p className="text-slate-400 mt-1">
              Toate documentele tale într-un singur loc.
            </p>

          </div>


          <AddDocumentDialog
            onSuccess={loadDocuments}
          />


        </div>



        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 mb-8">


          <Search
            size={18}
            className="text-slate-400"
          />


          <input

            value={search}

            onChange={(e) =>
              setSearch(e.target.value)
            }

            placeholder="Caută document..."

            className="w-full bg-transparent outline-none"

          />


        </div>




        {loading ? (

          <p className="text-slate-400">
            Se încarcă...
          </p>


        ) : filtered.length === 0 ? (


          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-16 text-center">


            <FileText
              size={60}
              className="mx-auto text-slate-600 mb-5"
            />


            <h2 className="text-2xl font-bold">
              Nu există documente
            </h2>


            <p className="text-slate-400 mt-2">
              Adaugă primul document.
            </p>


          </div>



        ) : (


          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">


            {filtered.map((doc) => (

              <DocumentCard

                key={doc.id}

                doc={doc}

                folders={folders}

                onDelete={() =>
                  deleteDocument(doc)
                }

              />

            ))}


          </div>


        )}



      </main>


    </div>

  );

}