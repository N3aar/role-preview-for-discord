import { Dispatch, Suspense, useCallback, useEffect, useState } from "react";
import { Sketch } from "@uiw/react-color";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";

export interface Role {
  id: number;
  name: string;
  colorOne: string;
  colorTwo: string;
}

interface RoleConfiguratorProps {
  roles: Role[];
  setRoles: Dispatch<Role[]>;
}

const discordDefaultColors = [
  "#1abc9c",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#e91e63",
  "#f1c40f",
  "#e67e22",
  "#e74d3c",
  "#95a5a6",
  "#607d8b",
  "#11806a",
  "#1f8b4c",
  "#206694",
  "#71368a",
  "#ad1457",
  "#c27c0e",
  "#a84300",
  "#992d22",
  "#979c9f",
  "#546e7a",
];

const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const isChildOf = (ref: EventTarget | null, selector: string) => {
  let cursor = ref as HTMLElement | null;
  while (cursor) {
    if (cursor.matches?.(selector)) return true;
    cursor = cursor.parentElement;
  }
  return false;
};

// ---------------- COMPONENT ------------------

export function RoleConfigurator({ roles, setRoles }: RoleConfiguratorProps) {
  const [openedColorPicker, setOpenedColorPicker] = useState<{
    roleId: number;
    type: "colorOne" | "colorTwo";
  } | null>(null);

  const addRole = () => {
    const id = Math.max(0, ...roles.map((r) => r.id)) + 1;
    const lastColor = roles.length > 0 ? roles[roles.length - 1].colorOne : "#2ecc71";
    setRoles([...roles, { id, name: `Role ${roles.length + 1}`, colorOne: lastColor, colorTwo: lastColor }]);
  };

  const deleteRole = (id: number) => {
    if (confirm("Are you sure you want to delete this role?")) {
      setRoles(roles.filter((role) => role.id !== id));
    }
  };

  const updateRole = (id: number, updates: Partial<Role>) => {
    setRoles(roles.map((role) => (role.id === id ? { ...role, ...updates } : role)));
  };

  const updateRoleOrder = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = reorder(roles, result.source.index, result.destination.index);
    setRoles(reordered);
  };

  const toggleColorPicker = (roleId: number, type: "colorOne" | "colorTwo") => {
    if (openedColorPicker?.roleId === roleId && openedColorPicker.type === type) {
      setOpenedColorPicker(null);
    } else {
      setOpenedColorPicker({ roleId, type });
    }
  };

  const handleWindowClick = useCallback(
    (ev: MouseEvent) => {
      if (openedColorPicker && !isChildOf(ev.target, ".RoleConfigurator .color-button-wrapper")) {
        setOpenedColorPicker(null);
      }
    },
    [openedColorPicker],
  );

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, [handleWindowClick]);

  return (
    <div className="RoleConfigurator">
      <DragDropContext onDragEnd={updateRoleOrder}>
        <Droppable droppableId="roles-droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="roles-list">
              {roles.map((role, index) => (
                <Draggable key={role.id} draggableId={role.id.toString()} index={index}>
                  {(provided) => (
                    <div className="role" ref={provided.innerRef} {...provided.draggableProps}>
                      <div className="options">
                        <div className="drag-handle-wrapper">
                          <div {...provided.dragHandleProps} className="drag-handle">
                            <div className="scuffed-drag-icon" title="Drag to reorder" />
                          </div>
                        </div>

                        <div className="color-button-wrapper">
                          <div className="color-buttons">
                            <button
                              className="color-button"
                              style={{ ["--role-color" as any]: role.colorOne }}
                              onClick={() => toggleColorPicker(role.id, "colorOne")}
                            >
                              {role.colorOne}
                            </button>
                            <button
                              className="color-button"
                              style={{ ["--role-color" as any]: role.colorTwo }}
                              onClick={() => toggleColorPicker(role.id, "colorTwo")}
                            >
                              {role.colorTwo}
                            </button>
                          </div>

                          {openedColorPicker?.roleId === role.id && openedColorPicker.type === "colorOne" && (
                            <Suspense fallback={<div className="color-picker placeholder">Loading...</div>}>
                              <Sketch
                                className="color-picker"
                                disableAlpha
                                color={role.colorOne}
                                presetColors={discordDefaultColors}
                                onChange={(color) => updateRole(role.id, { colorOne: color.hex })}
                              />
                            </Suspense>
                          )}

                          {openedColorPicker?.roleId === role.id && openedColorPicker.type === "colorTwo" && (
                            <Suspense fallback={<div className="color-picker placeholder">Loading...</div>}>
                              <Sketch
                                className="color-picker"
                                disableAlpha
                                color={role.colorTwo}
                                presetColors={discordDefaultColors}
                                onChange={(color) => updateRole(role.id, { colorTwo: color.hex })}
                              />
                            </Suspense>
                          )}
                        </div>

                        <input
                          className="name-input"
                          type="text"
                          value={role.name}
                          onChange={(e) => updateRole(role.id, { name: e.target.value })}
                        />

                        <div className="buttons">
                          <button className="delete-button" onClick={() => deleteRole(role.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button className="add-button" onClick={addRole}>
        Add role
      </button>
    </div>
  );
}
