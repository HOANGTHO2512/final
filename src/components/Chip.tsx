'use client';

interface ChipProps {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string, checked: boolean) => void;
  badge?: string | null;
}

export default function Chip({ label, value, checked, onChange, badge = null }: ChipProps) {
  return (
    <label className={`inline-flex items-center px-4 py-2 rounded-full cursor-pointer transition ${checked ? 'bg-blue-100 border-2 border-blue-500' : 'bg-slate-100 border-2 border-transparent hover:bg-slate-200'}`}>
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={(e) => onChange(value, e.target.checked)}
        className="hidden"
      />
      {badge && (
        <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold mr-1.5">
          {badge}
        </span>
      )}
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </label>
  );
}
