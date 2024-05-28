import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import "./users.css";

interface Section {
  id: number;
  name: string;
}

const initialSections: Section[] = [
  { id: 1, name: "Section 1" },
  { id: 2, name: "Section 2" },
  { id: 3, name: "Section 3" },
  { id: 4, name: "Section 4" },
  { id: 5, name: "Section 5" },
  { id: 6, name: "Section 6" },
  { id: 7, name: "Section 7" },
  { id: 8, name: "Section 8" },
  { id: 9, name: "Section 9" },
  { id: 10, name: "Section 10" },
  { id: 11, name: "Section 11" },
  { id: 12, name: "Section 12" },
  { id: 13, name: "Section 13" },
  { id: 14, name: "Section 14" },
  { id: 15, name: "Section 15" },
  { id: 16, name: "Section 16" },
  { id: 17, name: "Section 17" },
  { id: 18, name: "Section 18" },
  { id: 19, name: "Section 19" },
  { id: 20, name: "Section 20" },
];

const SortableSection = ({ section }: { section: Section }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id.toString() });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    width: "500px",
    height: "200px",
    border: "1px solid black",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="section"
    >
      {section.name}
    </div>
  );
};

const AnalyticsLayout = () => {
  const [sections, setSections] = useState<Section[]>(initialSections);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id === over?.id) {
      return;
    }
    setSections((sections) => {
      const oldIndex = sections.findIndex(
        (section) => section.id.toString() === active.id
      );
      const newIndex = sections.findIndex(
        (section) => section.id.toString() === over?.id
      );
      return arrayMove(sections, oldIndex, newIndex);
    });
  };

  return (
    <div className="analytics-layout">
      <DndContext onDragEnd={onDragEnd}>
        <SortableContext
          items={sections.map((section) => section.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          {sections.map((section) => (
            <SortableSection key={section.id.toString()} section={section} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default AnalyticsLayout;
