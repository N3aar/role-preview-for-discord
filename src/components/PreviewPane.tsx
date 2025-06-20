import { Role } from "@components/RoleConfigurator";
import { createDecoration } from "@utils/colorUtils";

interface PreviewPaneProps {
  theme: "dark" | "light";
  roles: Role[];
}

export function PreviewPane(props: PreviewPaneProps) {
  async function copyColor() {
    await navigator.clipboard.writeText("");
  }

  return (
    <div className={`PreviewPane ${props.theme}`}>
      <div className="messages">
        {props.roles.map((role) => (
          <div key={role.id} className="message" style={{ ["--role-color" as any]: role.colorOne }}>
            <div className="avatar">
              <div className="avatar-image" />
            </div>
            <div className="name gradient" style={createDecoration(role.colorOne, role.colorTwo)}>
              {role.name}
            </div>
            <div className="body">
              <div>example message!</div>
            </div>
          </div>
        ))}
      </div>
      <div className="sidebar">
        <div className="title">ONLINE—{props.roles.length}</div>
        {props.roles.map((role) => (
          <div key={role.id} className="member" style={{ ["--role-color" as any]: role.colorOne }}>
            <div className="avatar">
              <div className="avatar-image" />
            </div>
            <div className="name gradient" style={createDecoration(role.colorOne, role.colorTwo)}>
              {role.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
