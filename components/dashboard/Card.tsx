export function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <p className="text-sm text-gray-600 pb-2 font-semibold">{title}</p>
      <h2 className="text-2xl font-bold text-indigo-700">{value}</h2>
    </div>
  );
}
