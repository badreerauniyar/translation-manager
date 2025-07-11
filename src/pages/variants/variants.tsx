import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./variants.css";

interface Variant {
  variant_id: number;
  project_id: number;
  name: string;
  description: string;
  branch: string;
  status: string;
  owner: string;
  created_at: string;
  updated_at: string;
}

interface VariantModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (variant: Omit<Variant, 'created_at' | 'updated_at' | 'variant_id' | 'project_id'>) => void;
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
    owner: "Alice",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Add more variants as needed
];

const ROWS_PER_PAGE = 5;

function VariantModal({ open, onClose, onSave, initial, mode, projectId }: VariantModalProps) {
  const [form, setForm] = useState<Omit<Variant, 'created_at' | 'updated_at' | 'variant_id' | 'project_id'>>({
    name: "",
    description: "",
    branch: "",
    status: "",
    owner: "",
  });
  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        description: initial.description,
        branch: initial.branch,
        status: initial.status,
        owner: initial.owner,
      });
    } else {
      setForm({ name: "", description: "", branch: "", status: "", owner: "" });
    }
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
          <div className="modal-row">
            <label>Owner
              <input value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} required />
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
        placeholder="Search by variant name, branch, status, or owner..."
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
  const [page, setPage] = useState<number>(1);
  const navigate = useNavigate();

  // Filtered and paginated data
  const filtered = variants.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.branch.toLowerCase().includes(search.toLowerCase()) ||
    v.status.toLowerCase().includes(search.toLowerCase()) ||
    v.owner.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const startIdx = (page - 1) * ROWS_PER_PAGE;
  const pageData = filtered.slice(startIdx, startIdx + ROWS_PER_PAGE);

  // Modal handlers
  const openAdd = () => setModal({ open: true, mode: "add", variant: null });
  const openEdit = (variant: Variant) => setModal({ open: true, mode: "edit", variant });
  const closeModal = () => setModal({ open: false, mode: "add", variant: null });
  const handleSave = (form: Omit<Variant, 'created_at' | 'updated_at' | 'variant_id' | 'project_id'>) => {
    if (modal.mode === "add") {
      const now = new Date().toISOString();
      const newVariant: Variant = { ...form, variant_id: nextId, project_id: projectId, created_at: now, updated_at: now };
      setVariants([...variants, newVariant]);
      setNextId(nextId + 1);
    } else if (modal.variant) {
      setVariants(variants.map(v =>
        v.variant_id === modal.variant?.variant_id
          ? { ...v, ...form, updated_at: new Date().toISOString() }
          : v
      ));
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

  // Pagination controls
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  useEffect(() => { setPage(1); }, [search]);

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
      <div className="variants-table-wrapper">
        <table className="variants-table">
          <thead>
            <tr>
              <th>Variant Name</th>
              <th>Description</th>
              <th>Branch</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: '#888' }}>No variants found.</td></tr>
            ) : (
              pageData.map((variant) => (
                <tr key={variant.variant_id} style={{ cursor: 'pointer' }} onClick={e => {
                  if ((e.target as HTMLElement).tagName === 'BUTTON') return;
                  navigate(`/languageSelection/${variant.project_id}/${variant.variant_id}`);
                }}>
                  <td>{variant.name}</td>
                  <td>{variant.description}</td>
                  <td>{variant.branch}</td>
                  <td>{variant.status}</td>
                  <td>{variant.owner}</td>
                  <td>{new Date(variant.created_at).toLocaleString()}</td>
                  <td>{new Date(variant.updated_at).toLocaleString()}</td>
                  <td>
                    <button className="edit-btn" onClick={ev => { ev.stopPropagation(); openEdit(variant); }}>Edit</button>
                    <button className="delete-btn" onClick={ev => { ev.stopPropagation(); openDelete(variant); }}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>&lt;</button>
          <span>Page {page} of {totalPages || 1}</span>
          <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages || totalPages === 0}>&gt;</button>
        </div>
      </div>
      <VariantModal open={modal.open} onClose={closeModal} onSave={handleSave} initial={modal.variant} mode={modal.mode} projectId={projectId} />
      <ConfirmModal open={confirm.open} onClose={closeConfirm} onConfirm={handleDelete} message="Are you sure you want to delete this variant?" />
    </div>
  );
} 