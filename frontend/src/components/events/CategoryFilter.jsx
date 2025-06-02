import { CATEGORIES } from '../../constants/categories';
import CategoryIcons from '../ui/CategoryIcons';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const allCategories = [
    { value: 'all', label: 'Todas' },
    ...CATEGORIES
  ];

  return (
    <div className="mb-8">
      {/* Contenedor scrolleable horizontal */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {allCategories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`
              flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 min-w-[100px]
              ${selectedCategory === category.value
                ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-md'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            {/* Icono */}
            <div className={`
              w-8 h-8 flex items-center justify-center
              ${selectedCategory === category.value ? 'text-sky-600' : 'text-gray-500'}
            `}>
              {category.value === 'all' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              ) : (
                <CategoryIcons category={category.value} className="w-6 h-6" />
              )}
            </div>
            
            {/* Texto */}
            <span className={`
              text-xs font-medium text-center leading-tight
              ${selectedCategory === category.value ? 'text-sky-700' : 'text-gray-600'}
            `}>
              {category.label}
            </span>
          </button>
        ))}
      </div>
      
      {/* Indicador de filtro activo */}
      {selectedCategory !== 'all' && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <span>Filtrando por:</span>
          <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full font-medium flex items-center gap-2">
            <CategoryIcons category={selectedCategory} className="w-4 h-4" />
            {CATEGORIES.find(category => category.value === selectedCategory)?.label}
          </span>
          <button
            onClick={() => onCategoryChange('all')}
            className="text-sky-600 hover:text-sky-800 font-medium underline"
          >
            Limpiar filtro
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter; 