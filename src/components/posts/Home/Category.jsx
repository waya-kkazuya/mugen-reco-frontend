import { useQueryCategories } from '../../../hooks/category/useQueryCategories';

export default function Category({ selectedCategory, setSelectedCategory }) {
  const { data: categories, isLoading } = useQueryCategories();

  if (isLoading || !categories)
    return (
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <div className="text-center">Loading...</div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 mb-6">
      <div className="overflow-x-auto scrollbar-hide md:scrollbar-default">
        <div className="flex space-x-2 min-w-max whitespace-nowrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full border text-sm ${
              selectedCategory === null ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
            }`}
          >
            すべて
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full border text-sm ${
                selectedCategory === category.id
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
