"use client";

interface DetailSidebarProps {
  children: React.ReactNode;
  onCancel?: () => void;
  onSave?: () => void;
  saving?: boolean;
}

export default function DetailSidebar({
  children,
  onCancel,
  onSave,
  saving = false,
}: DetailSidebarProps) {
  return (
    <div className="w-full h-full flex flex-col bg-white border-l">

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {children}
      </div>

      {/* Footer */}
      <div className="p-6 border-t flex justify-between">
        <button
          onClick={onCancel}
          className="px-6 py-3 rounded-xl border text-[#ffffff] bg-[#ff0000] hover:cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={onSave}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-purple-600 text-white disabled:opacity-50 hover:cursor-pointer"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}