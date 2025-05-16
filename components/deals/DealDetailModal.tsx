import React from "react";

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
  stage: string;
  customer: { name: string };
  owner: { name: string };
  notes: Note[];
  tasks: Task[];
}

interface DealDetailModalProps {
  deal: Deal;
  onClose: () => void;
}

const DealDetailModal: React.FC<DealDetailModalProps> = ({ deal, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">{deal.name}</h2>
        <p>
          <strong>Nilai:</strong> Rp {deal.value.toLocaleString()}
        </p>
        <p>
          <strong>Customer:</strong> {deal.customer?.name}
        </p>
        <p>
          <strong>Owner:</strong> {deal.owner?.name}
        </p>

        <div className="mt-4">
          <h3 className="font-semibold mb-1">Catatan:</h3>
          <ul className="list-disc list-inside text-sm">
            {deal.notes.map((note) => (
              <li key={note.id}>{note.content}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-1">Tugas:</h3>
          <ul className="list-disc list-inside text-sm">
            {deal.tasks.map((task) => (
              <li key={task.id}>
                <span className={task.completed ? "line-through" : ""}>
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealDetailModal;
