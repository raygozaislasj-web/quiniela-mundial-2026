"use client";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

function SortableItem({
  id,
  index,
}: {
  id: string;
  index: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(
      transform
    ),
    transition,
  };

  const medallas = [
    "🥇",
    "🥈",
    "🥉",
    "🏅",
  ];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between bg-white border rounded-xl p-3 mb-2 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">
          {medallas[index]}
        </span>

        <span className="font-medium">
          {id}
        </span>
      </div>

      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-500 text-xl"
      >
        ⋮⋮
      </button>
    </div>
  );
}

export default function GrupoSortable({
  equipos,
  onChange,
  disabled,
}: {
  equipos: string[];
  onChange: (equipos: string[]) => void;
  disabled: boolean;
}) {
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        if (disabled) return;

        const { active, over } = event;

        if (
          !over ||
          active.id === over.id
        )
          return;

        const oldIndex =
          equipos.indexOf(
            active.id as string
          );

        const newIndex =
          equipos.indexOf(
            over.id as string
          );

        onChange(
          arrayMove(
            equipos,
            oldIndex,
            newIndex
          )
        );
      }}
    >
      <SortableContext
        items={equipos}
        strategy={
          verticalListSortingStrategy
        }
      >
        {equipos.map(
          (equipo, index) => (
            <SortableItem
              key={equipo}
              id={equipo}
              index={index}
            />
          )
        )}
      </SortableContext>
    </DndContext>
  );
}