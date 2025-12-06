/**
 * FilterButtons 컴포넌트
 * 
 * 할 일 필터링 버튼 그룹입니다.
 * All, Active, Completed 세 가지 필터를 제공합니다.
 * 
 * @param {Object} props
 * @param {string} props.filter - 현재 선택된 필터 ('all' | 'active' | 'completed')
 * @param {Function} props.onFilterChange - 필터 변경 핸들러
 * @param {number} props.allCount - 전체 개수
 * @param {number} props.activeCount - 미완료 개수
 * @param {number} props.completedCount - 완료 개수
 */

export default function FilterButtons({ 
  filter, 
  onFilterChange, 
  allCount, 
  activeCount, 
  completedCount 
}) {
  // 필터 버튼 데이터
  const filters = [
    { key: "all", label: "All", count: allCount },
    { key: "active", label: "Active", count: activeCount },
    { key: "completed", label: "Completed", count: completedCount },
  ];

  return (
    <div className="hufflepuff-card p-3 sm:p-4 mb-4 sm:mb-6 flex flex-wrap gap-2 sm:gap-3 justify-center">
      {filters.map(({ key, label, count }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`
            px-3 sm:px-4 py-1.5 sm:py-2 
            rounded-lg text-sm sm:text-base font-semibold 
            transition-colors
            ${filter === key 
              ? "bg-hufflepuff-gold text-hufflepuff-black" 
              : "bg-white dark:bg-hufflepuff-gray text-hufflepuff-gray dark:text-badger-cream hover:bg-hufflepuff-light"
            }
          `}
        >
          {label} ({count})
        </button>
      ))}
    </div>
  );
}

