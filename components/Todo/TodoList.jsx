/**
 * TodoList 컴포넌트
 * 
 * 할 일 목록을 렌더링하고 드래그 앤 드롭 기능을 제공합니다.
 * TodoForm과 TodoItem들을 포함합니다.
 * 
 * @param {Object} props
 * @param {Array} props.todos - 할 일 목록
 * @param {string} props.selectedDate - 선택된 날짜
 * @param {string} props.filter - 현재 필터 상태
 * @param {Function} props.onReorder - 순서 변경 핸들러
 * @param {Function} props.onToggle - 완료 토글 핸들러
 * @param {Function} props.onDelete - 삭제 핸들러
 * @param {Function} props.onAddTodo - 할 일 추가 핸들러
 * @param {Function} props.onAddSubtask - 서브태스크 추가 핸들러
 * @param {Function} props.onToggleSubtask - 서브태스크 완료 토글 핸들러
 * @param {Function} props.onDeleteSubtask - 서브태스크 삭제 핸들러
 */

import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";

import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import axios from "../../utils/api";

export default function TodoList({ 
  todos, 
  selectedDate, 
  filter, 
  onReorder, 
  onToggle, 
  onDelete, 
  onAddTodo, 
  onAddSubtask, 
  onToggleSubtask, 
  onDeleteSubtask 
}) {
  // ============================================
  // 드래그 앤 드롭 센서 설정
  // - PointerSensor: 마우스/터치 드래그
  // - KeyboardSensor: 키보드 접근성 지원
  // ============================================
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ============================================
  // 이벤트 핸들러
  // ============================================
  
  /** 할 일 추가 완료 시 */
  const handleAddTodo = (newTodo) => {
    onAddTodo(newTodo);
  };

  /** 순서 변경 후 백엔드 동기화 */
  const handleReorder = async (newTodos) => {
    try {
      onReorder(newTodos);
      
      // 백엔드에 새 순서 저장
      await axios.patch("/todos/reorder/positions", { 
        positions: newTodos.map((todo, index) => ({ 
          id: todo.id, 
          position: index 
        })) 
      });
    } catch (error) {
      console.error("Failed to update positions:", error);
    }
  };

  /** 드래그 종료 시 순서 재정렬 */
  const handleDragEnd = (event) => {
    const { active, over } = event;

    // 유효하지 않은 드롭이거나 같은 위치면 무시
    if (!over || active.id === over.id) return;

    // 새 순서 계산
    const oldIndex = todos.findIndex((todo) => todo.id === active.id);
    const newIndex = todos.findIndex((todo) => todo.id === over.id);
    const newTodos = arrayMove(todos, oldIndex, newIndex);
    
    handleReorder(newTodos);
  };

  // ============================================
  // 렌더링
  // ============================================
  return (
    <div>
      {/* 할 일 추가 폼 */}
      <TodoForm onAddTodo={handleAddTodo} selectedDate={selectedDate} />
      
      {/* 할 일 목록 */}
      <div>
        {todos.length === 0 ? (
          // 빈 상태 메시지
          <div className="hufflepuff-card p-12 text-center">
            <p className="text-2xl font-potter text-hufflepuff-gray dark:text-badger-cream">
              🦡 No tasks yet! Time to get productive!
            </p>
          </div>
        ) : (
          // 드래그 앤 드롭 컨텍스트
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={todos.map((todo) => todo.id)} 
              strategy={verticalListSortingStrategy}
            >
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  filter={filter}
                  onToggle={(id) => onToggle(id)}
                  onDelete={(id) => onDelete(id)}
                  onAddSubtask={(id, title) => onAddSubtask(id, title)}
                  onToggleSubtask={(todoId, subtaskId) => onToggleSubtask(todoId, subtaskId)}
                  onDeleteSubtask={(todoId, subtaskId) => onDeleteSubtask(todoId, subtaskId)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
