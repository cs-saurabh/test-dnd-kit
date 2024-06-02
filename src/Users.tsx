import { useState } from "react";
import "./users.css";
import { data } from "./data";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface User {
  id: number;
  name: string;
  column: { start: number; end: number };
  row: { start: number; end: number };
}

const SortableUser = ({ user }: { user: User }) => {
  // console.log(user);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: user.id.toString() });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    gridColumn: `${user.column.start} / ${user.column.end}`,
    gridRow: `${user.row.start} / ${user.row.end}`,
    height: "100px",
    overflow: "hidden", // Add this line
    textOverflow: "ellipsis", // Add this line
    whiteSpace: "nowrap", // Add this line
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

  // const addUser = () => {
  //   const newUser: User = {
  //     id: Date.now(),
  //     name: inputValue,
  //   };
  //   setInputValue("");
  //   setUsers((users) => [...users, newUser]);
  // };

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
      // Move item
      const newUsers = arrayMove(users, oldIndex, newIndex);

      // Update grid positions
      newUsers.forEach((user, index) => {
        user.column.start = (index % 6) + 1;
        user.column.end = user.column.start + 1;
        user.row.start = Math.floor(index / 6) + 1;
        user.row.end = user.row.start + 1;
      });

      return newUsers;
    });
  };

  return (
    <div className="users">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "10px",
          border: "1px solid black",
          width: "100%",
        }}
      >
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext
            items={users.map((user) => user.id.toString())}
            strategy={horizontalListSortingStrategy}
          >
            {users.map((user, index) => (
              <SortableUser key={user.id.toString()} user={user} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default Users;
