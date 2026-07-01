interface Props {
  title: string;
  expiry: string;
}

export default function DocumentCard({
  title,
  expiry,
}: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      <p className="text-slate-400 mt-2">
        Expiră la:
      </p>

      <p className="font-bold">
        {expiry}
      </p>
    </div>
  );
}