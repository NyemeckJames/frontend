import { useState } from "react";

interface HashtagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

const HashtagInput: React.FC<HashtagInputProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700">Hashtags</label>
      <div className="flex flex-wrap gap-2 border border-gray-300 rounded-md p-2 mt-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center bg-sky-100 text-sky-700 px-2 py-1 rounded-md text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-2 text-sky-900 hover:text-red-500"
            >
              ✕
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ajouter un hashtag..."
          className="flex-1 border-none focus:ring-0 outline-none text-sm p-1"
        />
      </div>
    </div>
  );
};

export default HashtagInput;
