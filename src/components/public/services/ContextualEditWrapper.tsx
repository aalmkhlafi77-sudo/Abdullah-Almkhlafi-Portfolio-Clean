import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Edit3, ArrowUp, ArrowDown, Copy, Trash2, Eye, EyeOff, Sliders, Check, X } from 'lucide-react';

interface ContextualEditWrapperProps {
  id: string;
  label: string;
  children: React.ReactNode;
  onEdit?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  className?: string;
}

export const ContextualEditWrapper: React.FC<ContextualEditWrapperProps> = ({
  id,
  label,
  children,
  onEdit,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  canMoveUp = false,
  canMoveDown = false,
  className = ''
}) => {
  const { 
    isAuthenticated, 
    isLiveEditMode, 
    selectedLiveElementId, 
    setSelectedLiveElementId,
    setShowLivePropertiesPanel 
  } = useApp();

  const isSelected = selectedLiveElementId === id;
  const isEditing = isAuthenticated && isLiveEditMode;
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  if (!isEditing) {
    return <div id={id} className={className}>{children}</div>;
  }

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLiveElementId(id);
    if (onEdit) {
      onEdit();
    } else {
      setShowLivePropertiesPanel(true);
    }
  };

  return (
    <div
      id={id}
      onClick={handleSelect}
      className={`relative group transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'ring-2 ring-[#C5A059] shadow-lg shadow-[#C5A059]/10 rounded-2xl'
          : 'hover:ring-1 hover:ring-[#C5A059]/50 rounded-2xl'
      } ${className}`}
    >
      {/* Floating Admin Toolbar on Hover/Select */}
      <div 
        className={`absolute top-2.5 right-2.5 z-40 flex items-center gap-1 bg-[#181818]/95 backdrop-blur-md border border-[#C5A059]/60 rounded-xl px-2 py-1 shadow-2xl transition-all duration-200 ${
          isSelected ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto scale-95 group-hover:scale-100'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <span className="text-[11px] font-semibold text-[#C5A059] px-1 select-none flex items-center gap-1 border-l border-white/10 ml-1">
          <Sliders className="w-3 h-3" />
          {label}
        </span>

        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLiveElementId(id);
              onEdit();
            }}
            title="تعديل الخصائص"
            className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <Edit3 className="w-3 h-3" />
          </button>
        )}

        {onMoveUp && canMoveUp && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            title="تحريك للأعلى"
            className="p-1 text-white/70 hover:text-[#C5A059] hover:bg-white/10 rounded transition-colors"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
        )}

        {onMoveDown && canMoveDown && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            title="تحريك للأسفل"
            className="p-1 text-white/70 hover:text-[#C5A059] hover:bg-white/10 rounded transition-colors"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        )}

        {onDuplicate && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            title="تكرار العنصر"
            className="p-1 text-white/70 hover:text-[#C5A059] hover:bg-white/10 rounded transition-colors"
          >
            <Copy className="w-3 h-3" />
          </button>
        )}

        {onDelete && (
          isConfirmingDelete ? (
            <div className="flex items-center gap-1 bg-red-950/90 border border-red-500/60 rounded px-1.5 py-0.5">
              <span className="text-[10px] font-bold text-red-300">حذف؟</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setIsConfirmingDelete(false);
                }}
                title="تأكيد الحذف"
                className="p-0.5 text-white hover:text-red-300 rounded transition-colors"
              >
                <Check className="w-3 h-3 text-red-400" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsConfirmingDelete(false);
                }}
                title="إلغاء الحذف"
                className="p-0.5 text-white/70 hover:text-white rounded transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsConfirmingDelete(true);
              }}
              title="حذف هذا العنصر"
              className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )
        )}
      </div>

      {children}
    </div>
  );
};

