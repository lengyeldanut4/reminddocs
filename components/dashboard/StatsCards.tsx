export default function StatsCards() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-10">
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
        <h3 className="text-slate-400">
          Total documente
        </h3>

        <p className="text-4xl font-bold mt-3">
          0
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
        <h3 className="text-slate-400">
          Expiră curând
        </h3>

        <p className="text-4xl font-bold mt-3 text-yellow-400">
          0
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
        <h3 className="text-slate-400">
          Expirate
        </h3>

        <p className="text-4xl font-bold mt-3 text-red-500">
          0
        </p>
      </div>
    </div>
  );
}