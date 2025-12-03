import { useState } from "react";
import { Check, Trash2, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TodoItem({ todo, onToggle, onDelete, onAddSubtask, onToggleSubtask, onDeleteSubtask }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleAddSubtask = () => {
    if (!subtaskTitle.trim()) return;
    onAddSubtask(todo.id, subtaskTitle.trim());
    setSubtaskTitle("");
    setShowSubtaskInput(false);
  };

  return (
    <div ref={setNodeRef} style={style} className="hufflepuff-card p-4 mb-3">
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mt-1 text-hufflepuff-gray dark:text-badger-cream">
          ⋮⋮
        </div>

        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
            todo.completed ? "bg-hufflepuff-gold dark:bg-hufflepuff-yellow border-hufflepuff-gold" : "border-hufflepuff-gray dark:border-badger-cream hover:border-hufflepuff-gold"
          }`}
        >
          {todo.completed && <Check size={16} className="text-hufflepuff-black" />}
        </button>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className={`text-lg ${todo.completed ? "line-through text-hufflepuff-gray dark:text-badger-cream" : "text-hufflepuff-black dark:text-hufflepuff-light"}`}>{todo.title}</span>

            <div className="flex items-center gap-2">
              <span className="text-sm text-hufflepuff-gray dark:text-badger-cream">{todo.date}</span>

              {todo.subtasks && todo.subtasks.length > 0 && (
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-hufflepuff-gold dark:text-hufflepuff-yellow hover:opacity-70">
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
              )}

              <button onClick={() => onDelete(todo.id)} className="text-red-500 hover:text-red-700 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Subtasks */}
          {isExpanded && (
            <div className="mt-3 ml-4 space-y-2">
              {todo.subtasks?.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleSubtask(todo.id, subtask.id)}
                    className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center ${
                      subtask.completed ? "bg-hufflepuff-yellow border-hufflepuff-yellow" : "border-hufflepuff-gray hover:border-hufflepuff-gold"
                    }`}
                  >
                    {subtask.completed && <Check size={12} />}
                  </button>

                  <span className={`flex-1 text-sm ${subtask.completed ? "line-through text-hufflepuff-gray" : "text-hufflepuff-black dark:text-badger-cream"}`}>{subtask.title}</span>

                  <button onClick={() => onDeleteSubtask(todo.id, subtask.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {/* Add Subtask */}
              {showSubtaskInput ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={subtaskTitle}
                    onChange={(e) => setSubtaskTitle(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddSubtask()}
                    placeholder="Subtask..."
                    className="flex-1 px-2 py-1 text-sm rounded border border-hufflepuff-gold dark:border-hufflepuff-yellow bg-white dark:bg-hufflepuff-gray"
                    autoFocus
                  />
                  <button onClick={handleAddSubtask} className="px-2 py-1 text-sm bg-hufflepuff-gold hover:bg-hufflepuff-yellow rounded">
                    Add
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowSubtaskInput(true)} className="flex items-center gap-1 text-sm text-hufflepuff-gold dark:text-hufflepuff-yellow hover:opacity-70">
                  <Plus size={14} />
                  Add Subtask
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
