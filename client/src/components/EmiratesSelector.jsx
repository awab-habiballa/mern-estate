import { Link } from "react-router-dom";

export default function EmiratesSelector() {
  const emirates = [
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain",
  ];

  return (
    <div className="bg-grayLight py-6">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-lg font-semibold mb-4">
          Looking for a specific emirate?
        </h2>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar">
          {emirates.map((emirate) => (
            <Link
              key={emirate}
              to={`/search?searchTerm=${emirate}`}
              className="px-4 py-2 bg-white text-grayDark border border-gray-300 rounded-full hover:border-brandBlue transition duration-300 flex-shrink-0"
            >
              {emirate}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
