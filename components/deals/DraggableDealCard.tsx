import { useDraggable } from "@dnd-kit/core";

type Stage = "Prospek" | "Negosiasi" | "Closing" | "Selesai";

interface Note {
  id: string;
  content: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface Deal {
  id: string;
  name: string;
  value: number;
  stage: Stage;
  customer: { name: string };
  owner: { name: string };
  notes: Note[];
  tasks: Task[];
}

export function DraggableDealCard({
  deal,
  onDetailClick,
}: {
  deal: Deal;
  onDetailClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: deal.id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onDoubleClick={onDetailClick}
      className="p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition duration-200 cursor-move"
    >
      <h3 className="font-medium text-lg">{deal.name}</h3>
      <p className="text-sm text-gray-600">Rp {deal.value.toLocaleString()}</p>
      <p className="text-sm text-gray-600">{deal.customer?.name}</p>
    </div>
  );
}
