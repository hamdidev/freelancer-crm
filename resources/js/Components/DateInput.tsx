interface Props {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    hint?: string;
    required?: boolean;
}

export default function DateInput({
    value,
    onChange,
    label,
    hint,
    required,
}: Props) {
    // Display DD.MM.YYYY to user, store YYYY-MM-DD in state
    const displayValue = value ? value.split("-").reverse().join(".") : "";

    function handleChange(raw: string) {
        // raw from input is YYYY-MM-DD
        onChange(raw);
    }

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {hint && (
                        <span className="ml-1 text-xs text-gray-400">
                            ({hint})
                        </span>
                    )}
                </label>
            )}
            <input
                type="date"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                required={required}
                lang="de-DE"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {value && (
                <p className="mt-1 text-xs text-gray-400">{displayValue}</p>
            )}
        </div>
    );
}
