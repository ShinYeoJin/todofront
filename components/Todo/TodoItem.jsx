/**
 * TodoItem 컴포넌트
 * 
 * 개별 할 일 항목을 렌더링합니다.
 * 드래그 앤 드롭, 완료 토글, 삭제, 서브태스크 관리 기능을 제공합니다.
 * 
 * @param {Object} props
 * @param {Object} props.todo - 할 일 데이터
 * @param {string} props.filter - 현재 필터 상태 ('all', 'active', 'completed')
 * @param {Function} props.onToggle - 완료 상태 토글 핸들러
 * @param {Function} props.onDelete - 삭제 핸들러
 * @param {Function} props.onAddSubtask - 서브태스크 추가 핸들러
 * @param {Function} props.onToggleSubtask - 서브태스크 완료 토글 핸들러
 * @param {Function} props.onDeleteSubtask - 서브태스크 삭제 핸들러
 */

import { useState } from "react";
import { Check, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import SubtaskList from "./SubtaskList";

export default function TodoItem({ 
  todo, 
  filter, 
  onToggle, 
  onDelete, 
  onAddSubtask, 
  onToggleSubtask, 
  onDeleteSubtask 
}) {
  // ============================================
  // State 관리
  // ============================================
  const [isExpanded, setIsExpanded] = useState(false);

  // ============================================
  // 드래그 앤 드롭 설정 (dnd-kit)
  // ============================================
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging 
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // ============================================
  // 서브태스크 관련 계산
  // ============================================
  const hasSubtasks = todo.subtasks && todo.subtasks.length > 0;
  const subtaskCount = todo.subtasks?.length || 0;
  const completedSubtaskCount = todo.subtasks?.filter((s) => s.completed).length || 0;

  // ============================================
  // 렌더링
  // ============================================
  return (
    <div ref={setNodeRef} style={style} className="hufflepuff-card p-3 sm:p-4 mb-2 sm:mb-3">
      <div className="flex items-start gap-2 sm:gap-3">
        
        {/* 드래그 핸들 (데스크톱에서만 표시) */}
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing mt-1 text-hufflepuff-gray dark:text-badger-cream hidden sm:block"
        >
          ⋮⋮
        </div>

        {/* 완료 체크박스 */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`
            flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 
            rounded border-2 flex items-center justify-center transition-colors
            ${todo.completed 
              ? "bg-hufflepuff-gold dark:bg-hufflepuff-yellow border-hufflepuff-gold" 
              : "border-hufflepuff-gray dark:border-badger-cream hover:border-hufflepuff-gold"
            }
          `}
        >
          {todo.completed && <Check size={14} className="sm:w-4 sm:h-4 text-hufflepuff-black" />}
        </button>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 min-w-0">
          
          {/* 제목 행 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
            
            {/* 제목 & 서브태스크 카운트 */}
            <div className="flex items-center gap-2 min-w-0">
              <span className={`
                text-sm sm:text-lg truncate
                ${todo.completed 
                  ? "line-through text-hufflepuff-gray dark:text-badger-cream" 
                  : "text-hufflepuff-black dark:text-hufflepuff-light"
                }
              `}>
                {todo.title}
              </span>
              
              {/* 서브태스크 진행 상황 뱃지 */}
              {hasSubtasks && (
                <span className="
                  text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 
                  rounded-full bg-hufflepuff-light dark:bg-hufflepuff-gray 
                  text-hufflepuff-gray dark:text-badger-cream flex-shrink-0
                ">
                  {completedSubtaskCount}/{subtaskCount}
                </span>
              )}
            </div>

            {/* 액션 버튼들 */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* 날짜 표시 */}
              <span className="text-xs sm:text-sm text-hufflepuff-gray dark:text-badger-cream">
                {todo.date ? new Date(todo.date).toLocaleDateString() : ""}
              </span>

              {/* 펼치기/접기 버튼 */}
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="text-hufflepuff-gold dark:text-hufflepuff-yellow hover:opacity-70 p-1"
                title={isExpanded ? "Collapse subtasks" : "Expand subtasks"}
              >
                {isExpanded 
                  ? <ChevronDown size={18} className="sm:w-5 sm:h-5" /> 
                  : <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                }
              </button>

              {/* 삭제 버튼 */}
              <button 
                onClick={() => onDelete(todo.id)} 
                className="text-red-500 hover:text-red-700 transition-colors p-1"
              >
                <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
          </div>

          {/* 서브태스크 섹션 */}
          {isExpanded && (
            <SubtaskList
              todoId={todo.id}
              subtasks={todo.subtasks || []}
              filter={filter}
              onAddSubtask={onAddSubtask}
              onToggleSubtask={onToggleSubtask}
              onDeleteSubtask={onDeleteSubtask}
            />
          )}
        </div>
      </div>
    </div>
  );
}
