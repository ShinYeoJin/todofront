/**
 * ProgressBar 컴포넌트
 * 
 * 진행률을 시각적으로 표시하는 프로그레스 바입니다.
 * 100% 달성 시 축하 메시지를 표시합니다.
 * 
 * @param {Object} props
 * @param {string} props.title - 프로그레스 바 제목 (예: "Overall Progress", "Daily Progress")
 * @param {number} props.progress - 진행률 (0-100)
 * @param {string} props.size - 크기 ('sm' | 'md'), 기본값 'md'
 * @param {boolean} props.showCongrats - 100% 달성 시 축하 메시지 표시 여부
 * @param {string} props.congratsMessage - 축하 메시지 (메인)
 * @param {string} props.congratsSubMessage - 축하 메시지 (서브)
 */

export default function ProgressBar({ 
  title, 
  progress, 
  size = "md",
  showCongrats = false,
  congratsMessage = "🎉 축하합니다! 모든 할 일을 완료했어요! 🎉",
  congratsSubMessage = ""
}) {
  // 크기에 따른 스타일
  const heightClass = size === "sm" ? "h-3" : "h-4";
  const titleClass = size === "sm" ? "text-sm" : "font-semibold";

  return (
    <div>
      {/* 제목 & 퍼센트 */}
      <div className="flex items-center justify-between mb-2">
        <span className={`${titleClass} text-hufflepuff-black dark:text-hufflepuff-light`}>
          {title}
        </span>
        <span className="text-lg font-bold text-hufflepuff-gold dark:text-hufflepuff-yellow">
          {progress}%
        </span>
      </div>
      
      {/* 프로그레스 바 */}
      <div className={`w-full bg-gray-200 dark:bg-hufflepuff-gray rounded-full ${heightClass} overflow-hidden`}>
        <div 
          className="h-full bg-gradient-to-r from-hufflepuff-gold to-hufflepuff-yellow transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* 100% 달성 시 축하 메시지 */}
      {showCongrats && progress === 100 && (
        <div className="mt-3 p-3 bg-gradient-to-r from-hufflepuff-gold/20 to-hufflepuff-yellow/20 rounded-lg border-2 border-hufflepuff-gold dark:border-hufflepuff-yellow">
          <p className="text-center font-bold text-hufflepuff-black dark:text-hufflepuff-yellow">
            {congratsMessage}
          </p>
          {congratsSubMessage && (
            <p className="text-center text-sm text-hufflepuff-gray dark:text-badger-cream mt-1">
              {congratsSubMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

