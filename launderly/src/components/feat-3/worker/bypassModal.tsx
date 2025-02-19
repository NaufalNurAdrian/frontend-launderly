
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (notes: string) => void;
}

export default function BypassModal({ isOpen, onClose, onSubmit }: ModalProps) {
  const [bypassNotes, setBypassNotes] = React.useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (bypassNotes.trim()) {
      onSubmit(bypassNotes);
      onClose();
    } else {
      alert("Please provide notes for bypass.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-semibold mb-4">Enter Bypass Notes</h2>
        <textarea
          value={bypassNotes}
          onChange={(e) => setBypassNotes(e.target.value)}
          className="w-full p-2 border bg-white border-blue-300 rounded-md mb-4"
          rows={4}
          placeholder="Add your notes here..."
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSubmit}
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
}