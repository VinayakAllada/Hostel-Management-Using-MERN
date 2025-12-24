const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,  
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg
                   bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
      />
    </div>
  );
};

export default Input;
