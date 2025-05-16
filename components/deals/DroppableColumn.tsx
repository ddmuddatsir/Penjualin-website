import { useDroppable } from "@dnd-kit/core";

type Stage = "Prospek" | "Negosiasi" | "Closing" | "Selesai";

export function DroppableColumn({
  stage,
  children,
}: {
  stage: Stage;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id: stage });
  return (
    <div
      ref={setNodeRef}
      className="bg-white rounded-lg shadow-md p-4 min-h-[300px]"
    >
      <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-indigo-600">
        {stage}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
