export default function Chip({
    label,
    value,
    checked,
    onChange,
    badge = null
}) {
    return (
        <label className={`chip ${checked ? 'checked' : ''}`}>
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
            <span>{label}</span>
        </label>
    );
}
