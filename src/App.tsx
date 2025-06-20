import { useRef, useState } from "react";
import { PreviewPane } from "@components/PreviewPane";
import { Role, RoleConfigurator } from "@components/RoleConfigurator";

const defaultRoles: Role[] = [
  {
    id: 1,
    name: "Example 1",
    colorOne: "#4cadd0",
    colorTwo: "#b2f9ff",
  },
  {
    id: 2,
    name: "Example 2",
    colorOne: "#9e6bff",
    colorTwo: "#9fc1ff",
  },
];

export function App() {
  const [roles, setRoles] = useState<Role[]>(JSON.parse(JSON.stringify(defaultRoles)));

  const previewRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="App">
      <div className="main-wrapper">
        <div className="title">
          <h1>Role Preview for Discord</h1>
          <p>Preview role colors with gradients!</p>
        </div>

        <div className="config">
          <h2>Roles</h2>
          <RoleConfigurator roles={roles} setRoles={setRoles} />
        </div>

        <div className="preview">
          <h2>Preview</h2>
          <div className="image-preview-wrapper">
            <div className="image-preview-padding" ref={previewRef}>
              <PreviewPane theme="dark" roles={roles} />
              <PreviewPane theme="light" roles={roles} />
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="footer-content">
          <p>
            <a href="https://github.com/N3aar/role-preview-for-discord">The source code is available on GitHub</a>
          </p>
        </div>
      </div>
    </div>
  );
}
