import { useState, useRef, useEffect } from "react";
import "./variants.css";

interface Variant {
  variant_id: number;
  project_id: number;
  name: string;
  description: string;
  branch: string;
  status: string;
}

interface VariantModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (variant: Variant) => void;
  initial: Variant | null;
  mode: "add" | "edit";
  projectId: number;
}

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const initialVariants: Variant[] = [
  {
    variant_id: 1,
    project_id: 1,
    name: "Base",
    description: "Base Variant",
    branch: "Master",
    status: "In Progress",
  },
  // Add more variants as needed
];

function VariantModal({ open, onClose, onSave, initial, mode, projectId }: VariantModalProps) {
  const [form, setForm] = useState<Variant>(
    initial || { variant_id: 0, project_id: projectId, name: "", description: "", branch: "", status: "" }
  );
  useEffect(() => {
    if (initial) setForm(initial);
    else setForm({ variant_id: 0, project_id: projectId, name: "", description: "", branch: "", status: "" });
  }, [initial, open, projectId]);
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content-smooth">
        <h3 style={{ marginBottom: 8 }}>{mode === "add" ? "Create New Variant" : "Edit Variant"}</h3>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave(form);
          }}
          className="modal-form-smooth"
        >
          <div className="modal-row">
            <label>Variant Name
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>Branch
              <input value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })} required />
            </label>
          </div>
          <div className="modal-row">
            <label>Description
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
            </label>
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
        placeholder="Search by variant name, branch, or status..."
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

export default function Variants() {
  // For demo, assume project_id = 1
  const projectId = 1;
  const [variants, setVariants] = useState<Variant[]>(initialVariants);
  const [search, setSearch] = useState<string>("");
  const [modal, setModal] = useState<{ open: boolean; mode: "add" | "edit"; variant: Variant | null }>({ open: false, mode: "add", variant: null });
  const [confirm, setConfirm] = useState<{ open: boolean; variant: Variant | null }>({ open: false, variant: null });
  const [nextId, setNextId] = useState<number>(2); // Start from 2 if 1 is used

  // Filtered data
  const filtered = variants.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.branch.toLowerCase().includes(search.toLowerCase()) ||
    v.status.toLowerCase().includes(search.toLowerCase())
  );

  // Modal handlers
  const openAdd = () => setModal({ open: true, mode: "add", variant: null });
  const openEdit = (variant: Variant) => setModal({ open: true, mode: "edit", variant });
  const closeModal = () => setModal({ open: false, mode: "add", variant: null });
  const handleSave = (variant: Variant) => {
    if (modal.mode === "add") {
      const newVariant = { ...variant, variant_id: nextId, project_id: projectId };
      setVariants([...variants, newVariant]);
      setNextId(nextId + 1);
    } else {
      setVariants(variants.map(v => (v.variant_id === modal.variant?.variant_id ? { ...variant, variant_id: v.variant_id, project_id: v.project_id } : v)));
    }
    closeModal();
  };
  // Delete handlers
  const openDelete = (variant: Variant) => setConfirm({ open: true, variant });
  const closeConfirm = () => setConfirm({ open: false, variant: null });
  const handleDelete = () => {
    setVariants(variants.filter(v => v.variant_id !== confirm.variant?.variant_id));
    closeConfirm();
  };

  return (
    <div className="variants-mgmt-container">
      <div className="variants-mgmt-header-flex">
        <div>
          <h2>Variants <span className="variants-mgmt-subtitle">Variants of the project OnlyTranslation</span></h2>
        </div>
        <div className="variants-mgmt-header-right">
          <SearchBox value={search} onChange={setSearch} />
          <button className="add-project-btn" onClick={openAdd}>+ Create New Variant</button>
        </div>
      </div>
      <div className="variants-list-scroll">
        {filtered.length === 0 ? (
          <div style={{ color: '#888', margin: '40px auto' }}>No variants found.</div>
        ) : (
          filtered.map((variant) => (
            <div className="variant-card" key={variant.variant_id}>
              <div className="variant-card-header">
                <div className="variant-card-title">{variant.name}</div>
                <div className="variant-card-actions">
                  <button className="edit-btn" onClick={() => openEdit(variant)}>Edit</button>
                  <button className="delete-btn" onClick={() => openDelete(variant)}>Delete</button>
                </div>
              </div>
              <div className="variant-card-desc">{variant.description}</div>
              <div className="variant-card-bottom">
                <div className="variant-card-branch">Branch <span>{variant.branch}</span></div>
                <div className="variant-card-status">{variant.status}</div>
              </div>
            </div>
          ))
        )}
      </div>
      <VariantModal open={modal.open} onClose={closeModal} onSave={handleSave} initial={modal.variant} mode={modal.mode} projectId={projectId} />
      <ConfirmModal open={confirm.open} onClose={closeConfirm} onConfirm={handleDelete} message="Are you sure you want to delete this variant?" />
    </div>
  );
} 