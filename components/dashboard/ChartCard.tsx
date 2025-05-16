export function ChartCard({
  title,
  children,
  customHeight = "h-[200px]",
}: {
  title: string;
  children: React.ReactNode;
  customHeight?: string;
}) {
  return (
    <div className={`bg-white p-4 rounded-xl shadow-sm   ${customHeight}`}>
      <h5 className="text-md font-semibold mb-4 text-gray-700">{title}</h5>
      {children}
    </div>
  );
}
