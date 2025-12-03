import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TodoItem from "./TodoItem";

export default function TodoList({ todos, onReorder, onToggle, onDelete, onAddSubtask, onToggleSubtask, onDeleteSubtask }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);
      const newTodos = arrayMove(todos, oldIndex, newIndex);
      onReorder(newTodos);
    }
  };

  if (todos.length === 0) {
    return (
      <div className="hufflepuff-card p-12 text-center">
        <p className="text-2xl font-potter text-hufflepuff-gray dark:text-badger-cream">🦡 No tasks yet! Time to get productive!</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} onAddSubtask={onAddSubtask} onToggleSubtask={onToggleSubtask} onDeleteSubtask={onDeleteSubtask} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
