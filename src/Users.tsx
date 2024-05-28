import { useState } from "react";
import "./users.css";
import { data } from "./data";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface User {
  id: number;
  name: string;
}

const SortableUser = ({ user }: { user: User }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: user.id.toString() });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    width: "100px",
    height: "100px",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="user"
    >
      {user.name}
    </div>
  );
};

const Users = () => {
  const [users, setUsers] = useState<User[]>(data);
  const [inputValue, setInputValue] = useState<string>("");

  const addUser = () => {
    const newUser: User = {
      id: Date.now(),
      name: inputValue,
    };
    setInputValue("");
    setUsers((users) => [...users, newUser]);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id === over?.id) {
      return;
    }
    setUsers((users) => {
      const oldIndex = users.findIndex(
        (user) => user.id.toString() === active.id
      );
      const newIndex = users.findIndex(
        (user) => user.id.toString() === over?.id
      );
      return arrayMove(users, oldIndex, newIndex);
    });
  };

  return (
    <div className="users">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "10px",
        }}
      >
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext
            items={users.map((user) => user.id.toString())}
            strategy={horizontalListSortingStrategy}
          >
            {users.map((user) => (
              <SortableUser key={user.id.toString()} user={user} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default Users;
