import { useState, useRef, useEffect } from "react";
import "./projects.css";

interface Project {
  id: number;
  name: string;
  type: string;
  status: string;
}

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  initial: Project | null;
  mode: "add" | "edit";
}

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const initialProjects: Project[] = [
  { id: 1, name: "Translation", type: "Web", status: "In Progress" },
  // { id: 2, name: "Localization", type: "Mobile", status: "Completed" },
  // { id: 3, name: "Docs Update", type: "Docs", status: "Pending" },
];

function ProjectModal({ open, onClose, onSave, initial, mode }: ProjectModalProps) {
  const [form, setForm] = useState<Project>(
    initial || { id: 0, name: "", type: "", status: "" }
  );
  useEffect(() => {
    if (initial) setForm(initial);
    else setForm({ id: 0, name: "", type: "", status: "" });
  }, [initial, open]);
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content-smooth">
        <h3 style={{ marginBottom: 8 }}>{mode === "add" ? "Create New Project" : "Edit Project"}</h3>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave(form);
          }}
          className="modal-form-smooth"
        >
          <div className="modal-row">
            <label>Project Name
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>Type
              <input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required />
            </label>
          </div>
          <div className="modal-row">
            <label>Status
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} required>
                <option value="">Select status</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
            </label>
          </div>
          <div className="modal-actions">
            <button type="submit">{mode === "add" ? "Create" : "Save"}</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({ open, onClose, onConfirm, message }: ConfirmModalProps) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm}>Delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focused]);
  return (
    <div className={`searchbox-container${focused ? ' focused' : ''}`}> 
      <i className="fa-solid fa-magnifying-glass searchbox-icon" onClick={() => setFocused(true)} style={{ cursor: 'pointer' }}></i>
      <input
        ref={inputRef}
        type="text"
        className="searchbox-input"
        placeholder="Search by project name, type, or status..."
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value && (
        <button className="searchbox-clear" onClick={() => { onChange(""); inputRef.current?.focus(); }} tabIndex={-1}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      )}
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState<string>("");
  const [modal, setModal] = useState<{ open: boolean; mode: "add" | "edit"; project: Project | null }>({ open: false, mode: "add", project: null });
  const [confirm, setConfirm] = useState<{ open: boolean; project: Project | null }>({ open: false, project: null });
  const [nextId, setNextId] = useState<number>(2); // Start from 2 if 1 is used

  // Filtered data
  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase()) ||
    p.status.toLowerCase().includes(search.toLowerCase())
  );

  // Modal handlers
  const openAdd = () => setModal({ open: true, mode: "add", project: null });
  const openEdit = (project: Project) => setModal({ open: true, mode: "edit", project });
  const closeModal = () => setModal({ open: false, mode: "add", project: null });
  const handleSave = (project: Project) => {
    if (modal.mode === "add") {
      const newProject = { ...project, id: nextId };
      setProjects([...projects, newProject]);
      setNextId(nextId + 1);
    } else {
      setProjects(projects.map(p => (p.id === modal.project?.id ? { ...project, id: p.id } : p)));
    }
    closeModal();
  };
  // Delete handlers
  const openDelete = (project: Project) => setConfirm({ open: true, project });
  const closeConfirm = () => setConfirm({ open: false, project: null });
  const handleDelete = () => {
    setProjects(projects.filter(p => p.id !== confirm.project?.id));
    closeConfirm();
  };

  return (
    <div className="projects-mgmt-container">
      <div className="projects-mgmt-header-flex">
        <h2>Projects</h2>
        <div className="projects-mgmt-header-right">
          <SearchBox value={search} onChange={setSearch} />
          <button className="add-project-btn" onClick={openAdd}>+ Create New Project</button>
        </div>
      </div>
      <div className="projects-table-wrapper">
        <table className="projects-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#888' }}>No projects found.</td></tr>
            ) : (
              filtered.map((project, idx) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.type}</td>
                  <td>{project.status}</td>
                  <td>
                    <button className="edit-btn" onClick={() => openEdit(project)}>Edit</button>
                    <button className="delete-btn" onClick={() => openDelete(project)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ProjectModal open={modal.open} onClose={closeModal} onSave={handleSave} initial={modal.project} mode={modal.mode} />
      <ConfirmModal open={confirm.open} onClose={closeConfirm} onConfirm={handleDelete} message="Are you sure you want to delete this project?" />
    </div>
  );
}