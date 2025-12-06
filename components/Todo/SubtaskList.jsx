/**
 * SubtaskList 컴포넌트
 * 
 * 서브태스크 목록을 렌더링하고 관리합니다.
 * 서브태스크 추가, 토글, 삭제 기능을 제공합니다.
 * 
 * @param {Object} props
 * @param {number} props.todoId - 부모 할 일 ID
 * @param {Array} props.subtasks - 서브태스크 목록
 * @param {string} props.filter - 현재 필터 상태
 * @param {Function} props.onAddSubtask - 서브태스크 추가 핸들러
 * @param {Function} props.onToggleSubtask - 서브태스크 토글 핸들러
 * @param {Function} props.onDeleteSubtask - 서브태스크 삭제 핸들러
 */

import { useState } from "react";
import { Check, Trash2, Plus } from "lucide-react";

export default function SubtaskList({ 
  todoId, 
  subtasks = [], 
  filter, 
  onAddSubtask, 
  onToggleSubtask, 
  onDeleteSubtask 
}) {
  // ============================================
  // State 관리
  // ============================================
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [showInput, setShowInput] = useState(false);

  // ============================================
  // 필터링된 서브태스크
  // ============================================
  const filteredSubtasks = subtasks.filter((subtask) => {
    if (filter === "active") return !subtask.completed;
    if (filter === "completed") return subtask.completed;
    return true;
  });

  const hasSubtasks = subtasks.length > 0;

  // ============================================
  // 이벤트 핸들러
  // ============================================
  const handleAdd = () => {
    if (!subtaskTitle.trim()) return;
    
    onAddSubtask(todoId, subtaskTitle.trim());
    setSubtaskTitle("");
    setShowInput(false);
  };

  const handleCancel = () => {
    setShowInput(false);
    setSubtaskTitle("");
  };

  // ============================================
  // 렌더링
  // ============================================
  return (
    <div className="mt-3 ml-4 space-y-2 border-l-2 border-hufflepuff-gold dark:border-hufflepuff-yellow pl-3">
      
      {/* 서브태스크 목록 */}
      {filteredSubtasks.length > 0 ? (
        filteredSubtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-center gap-2">
            {/* 체크박스 */}
            <button
              onClick={() => onToggleSubtask(todoId, subtask.id)}
              className={`
                flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center
                ${subtask.completed 
                  ? "bg-hufflepuff-yellow border-hufflepuff-yellow" 
                  : "border-hufflepuff-gray hover:border-hufflepuff-gold"
                }
              `}
            >
              {subtask.completed && <Check size={12} />}
            </button>

            {/* 제목 */}
            <span className={`
              flex-1 text-sm
              ${subtask.completed 
                ? "line-through text-hufflepuff-gray" 
                : "text-hufflepuff-black dark:text-badger-cream"
              }
            `}>
              {subtask.title}
            </span>

            {/* 삭제 버튼 */}
            <button 
              onClick={() => onDeleteSubtask(todoId, subtask.id)} 
              className="text-red-400 hover:text-red-600"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))
      ) : (
        // 필터링 결과가 없는 경우
        filter !== "all" && hasSubtasks && (
          <p className="text-sm text-hufflepuff-gray dark:text-badger-cream italic">
            No {filter} subtasks
          </p>
        )
      )}

      {/* 서브태스크 추가 */}
      {showInput ? (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={subtaskTitle}
            onChange={(e) => setSubtaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Enter subtask..."
            className="
              flex-1 px-2 py-1 text-sm rounded border 
              border-hufflepuff-gold dark:border-hufflepuff-yellow 
              bg-white dark:bg-hufflepuff-gray 
              text-hufflepuff-black dark:text-hufflepuff-light 
              focus:outline-none focus:ring-1 focus:ring-hufflepuff-yellow
            "
            autoFocus
          />
          <button 
            onClick={handleAdd} 
            className="px-2 py-1 text-sm bg-hufflepuff-gold hover:bg-hufflepuff-yellow text-hufflepuff-black rounded font-semibold"
          >
            Add
          </button>
          <button 
            onClick={handleCancel} 
            className="px-2 py-1 text-sm text-hufflepuff-gray hover:text-hufflepuff-black dark:text-badger-cream dark:hover:text-hufflepuff-light"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setShowInput(true)} 
          className="flex items-center gap-1 text-sm text-hufflepuff-gold dark:text-hufflepuff-yellow hover:opacity-70 mt-2"
        >
          <Plus size={14} />
          Add Subtask
        </button>
      )}
    </div>
  );
}

