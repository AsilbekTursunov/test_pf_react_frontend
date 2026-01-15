"use client"

export function SearchBar({ value, onChange, placeholder = "Поиск..." }) {
  return (
    <div className="relative flex-1">
      <svg 
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 text-[13px] border border-slate-300 rounded focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]"
      />
    </div>
  )
}
