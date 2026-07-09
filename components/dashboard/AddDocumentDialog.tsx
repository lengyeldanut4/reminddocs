"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddDocumentDialog({
  onSuccess,
  folderId = null,
}: {
  onSuccess: () => void;
  folderId?: string | null;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [folders, setFolders] = useState<any[]>([]);
  const [selectedFolder, setSelectedFolder] = useState(folderId ?? "");

  useEffect(() => {
    loadFolders();
  }, []);

  async function loadFolders() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("folders")
      .select("id,name")
      .eq("user_id", user.id)
      .order("name");

    setFolders(data || []);
  }


  async function save() {

    if (!title || !date) return;


    const {
      data: { user },
    } = await supabase.auth.getUser();


    if (!user) return;


   let fileUrl = null;
let fileName = null;
let fileType = null;
let filePath = null;


    // UPLOAD FIȘIER
    if (file) {

      const path = `${user.id}/${Date.now()}-${file.name}`;
      filePath = path;


      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(path, file);


      if (uploadError) {
        alert(uploadError.message);
        return;
      }


      const { data: signedData, error: signedError } =
  await supabase.storage
    .from("documents")
    .createSignedUrl(path, 60 * 60);

if (signedError) {
  alert(signedError.message);
  return;
}

fileUrl = signedData.signedUrl;
      fileName = file.name;
      fileType = file.type;
    }


    const { error } = await supabase
      .from("documents")
      .insert({

        user_id: user.id,

        title,

        expiry_date: date,

        folder_id:
          selectedFolder || null,

        file_url: fileUrl,

        file_name: fileName,

        file_type: fileType,
        
        file_path: filePath,

      });


    if(error){
      alert(error.message);
      return;
    }


    setTitle("");
    setDate("");
    setFile(null);

    onSuccess();
  }


  return (

    <div className="space-y-3">

      <Input
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        placeholder="Nume document"
        className="bg-slate-900 border-slate-700"
      />


      <Input
        type="date"
        value={date}
        onChange={(e)=>setDate(e.target.value)}
        className="bg-slate-900 border-slate-700"
      />


      <Input
        type="file"
        accept="application/pdf,image/*"
        onChange={(e)=>setFile(e.target.files?.[0] || null)}
        className="bg-slate-900 border-slate-700"
      />


      {!folderId && (

        <select
          value={selectedFolder}
          onChange={(e)=>setSelectedFolder(e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white"
        >

          <option value="">
            Fără folder
          </option>


          {folders.map((folder)=>(

            <option
              key={folder.id}
              value={folder.id}
            >
              {folder.name}
            </option>

          ))}

        </select>

      )}


      <Button
        onClick={save}
        className="w-full bg-blue-600"
      >
        + Document
      </Button>


    </div>

  );
}