"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { Upload, FileText, Image as ImageIcon } from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function AddDocumentDialog({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Nu ești logat");
      setLoading(false);
      return;
    }

    let fileUrl = null;

    // 📦 Upload file in Supabase Storage (optional)
    if (file) {
      const fileName = `${user.id}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, file);

      if (uploadError) {
        alert(uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("documents")
        .getPublicUrl(fileName);

      fileUrl = data.publicUrl;
    }

    const { error } = await supabase.from("documents").insert({
      user_id: user.id,
      title,
      expiry_date: expiryDate,
      file_url: fileUrl,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setTitle("");
    setExpiryDate("");
    setFile(null);

    onSuccess();
    setLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Upload className="w-4 h-4 mr-2" />
          Adaugă document
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-slate-950 border border-slate-800 text-white max-w-xl">

        <DialogHeader>
          <DialogTitle className="text-2xl">
            Adaugă document nou
          </DialogTitle>
        </DialogHeader>

        {/* UPLOAD ZONE */}
        <div className="border border-dashed border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition">

          <input
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            id="fileUpload"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <label htmlFor="fileUpload" className="cursor-pointer">

            {!file ? (
              <>
                <Upload className="mx-auto mb-3 text-slate-400" />
                <p className="text-slate-400">
                  Trage un fișier sau click pentru upload
                </p>
                <p className="text-xs text-slate-600 mt-2">
                  PDF, JPG, PNG
                </p>
              </>
            ) : (
              <>
                <FileText className="mx-auto mb-3 text-green-400" />
                <p className="text-green-400 font-semibold">
                  {file.name}
                </p>
              </>
            )}

          </label>
        </div>

        <Separator className="bg-slate-800" />

        {/* FORM */}
        <div className="space-y-4">

          <div>
            <Label>Nume document</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Carte de identitate"
              className="bg-slate-900 border-slate-700"
            />
          </div>

          <div>
            <Label>Data expirării</Label>
            <Input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="bg-slate-900 border-slate-700"
            />
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">

          <Button
            variant="outline"
            className="border-slate-700"
          >
            Anulează
          </Button>

          <Button
            onClick={handleUpload}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Se salvează..." : "Salvează"}
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
}