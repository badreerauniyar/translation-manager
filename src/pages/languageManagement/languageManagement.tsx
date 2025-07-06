import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./languageManagement.css";

// Language library utility
const LANGUAGE_LIB = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "it", name: "Italian" },
  { code: "jp", name: "Japanese" },
  // Add more as needed
];
const getLanguageName = (code: string) => LANGUAGE_LIB.find(l => l.code === code)?.name || code;

const ROWS_PER_PAGE = 5;

interface TranslationRow {
  string_id: string;
  from_value: string;
  to_values: string[];
  status: string;
}

const initialRows: TranslationRow[] = [
  {
    string_id: "STR001",
    from_value: "Hello World!",
    to_values: ["Bonjour le monde!", "Salut tout le monde!"],
    status: "Pending",
  },
  {
    string_id: "STR002",
    from_value: "Goodbye!",
    to_values: ["Au revoir!"],
    status: "Approved",
  },
  {
    string_id: "STR003",
    from_value: "Merci",
    to_values: ["Thank you", "Thanks", "Thx"],
    status: "Pending",
  },
];

export default function LanuageMangement() {
  const { projectId, variantsId, languageId } = useParams();
  const [rows, setRows] = useState<TranslationRow[]>(initialRows);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState<{ row: number, type: 'cell' | 'row' } | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [newString, setNewString] = useState({ string_id: "", from_value: "", to_values: [""], status: "" });
  const [fromLanguage, setFromLanguage] = useState(LANGUAGE_LIB[0].code);
  const [toValuesEdit, setToValuesEdit] = useState<{ row: number; idx: number } | null>(null);
  const [editValue, setEditValue] = useState("");

  // Filtering
  let filtered = rows.filter(row =>
  (row.string_id.toLowerCase().includes(search.toLowerCase()) ||
    row.from_value.toLowerCase().includes(search.toLowerCase()) ||
    row.to_values.some(val => val.toLowerCase().includes(search.toLowerCase())))
  );
  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const pageData = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  // Handlers
  const handleAddString = () => {
    setRows([{ ...newString, to_values: newString.to_values.filter(v => v.trim() !== "") }, ...rows]);
    setAddModal(false);
    setNewString({ string_id: "", from_value: "", to_values: [""], status: "" });
  };
  const handleToValueChange = (rowIdx: number, idx: number, value: string) => {
    setRows(rows => rows.map((row, rIdx) => rIdx === rowIdx ? {
      ...row,
      to_values: row.to_values.map((v, vIdx) => vIdx === idx ? value : v)
    } : row));
  };
  const handleDeleteToValue = (rowIdx: number, idx: number) => {
    setRows(rows => rows.map((row, rIdx) => rIdx === rowIdx ? {
      ...row,
      to_values: row.to_values.filter((_, vIdx) => vIdx !== idx)
    } : row));
  };
  const handleAddToValue = (rowIdx: number) => {
    setRows(rows => rows.map((row, rIdx) => rIdx === rowIdx && row.to_values.length < 3 ? {
      ...row,
      to_values: [...row.to_values, ""]
    } : row));
  };
  const handleEditRow = (rowIdx: number) => {
    setAddModal(true);
    setNewString({ ...rows[rowIdx] });
    setRows(rows => rows.filter((_, idx) => idx !== rowIdx));
  };
  const handleDeleteRow = (rowIdx: number) => {
    setRows(rows => rows.filter((_, idx) => idx !== rowIdx));
  };
  // Length check: green if all to_values <= 50 chars, else red
  const isLengthOk = (vals: string[]) => vals.every(val => val.length <= 50);

  // Pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  // Global from language change
  const handleFromLangChange = (lang: string) => {
    setFromLanguage(lang);
  };
  useEffect(() => {
    setRows(rows => rows.map(row => ({ ...row }))); // force rerender
  }, [fromLanguage]);

  // Reset page on search
  useEffect(() => { setPage(1); }, [search]);

  // Get language name from code
  const fromLanguageName = getLanguageName(fromLanguage);
  const toLanguageName = getLanguageName(languageId as string);

  const handleMenuOpen = (rowIdx: number, type: 'cell' | 'row') => setMenuOpen({ row: rowIdx, type });
  const handleMenuClose = () => setMenuOpen(null);

  return (
    <div className="lm-container">
      <h1 className="lm-header">Language Management</h1>
      <div className="lm-header" style={{ fontWeight: 500, fontSize: 16, marginBottom: 16 }}>
        Project ID: {projectId} | Variant ID: {variantsId} | To Language: {toLanguageName}
      </div>
      {/* Filter row: search on right, from language dropdown, add button */}
      <div className="lm-filters d-flex justify-content-between" style={{ display: 'flex', alignItems: 'center', marginBottom: 18, justifyContent: 'flex-end', gap: 16 }}>
        <div className="d-flex align-items-center">
          <label htmlFor="" className="me-3">Master Language</label>
          <select className="lm-translation-dropdown" value={fromLanguage} onChange={e => handleFromLangChange(e.target.value)}>
            {LANGUAGE_LIB.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
          </select>
        </div>
        <div className="d-flex align-items-center">
          <div className="searchbox-container me-3" >
            <i className="fa-solid fa-magnifying-glass searchbox-icon" style={{ cursor: 'pointer' }}></i>
            <input
              type="text"
              className="searchbox-input lm-search-smooth"
              placeholder="Search by string, from value, or to value..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ transition: 'box-shadow 0.2s, border-color 0.2s', minWidth: 220 }}
            />
          </div>
          <button className="lm-add-btn" onClick={() => { setAddModal(true); setNewString({ string_id: "", from_value: "", to_values: [""], status: "" }); }}>+ Add String</button>

        </div>
      </div>
      {addModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-content-smooth">
            <h3 style={{ marginBottom: 8 }}>Add/Edit String</h3>
            <div className="modal-form-smooth">
              <div className="modal-row">
                <label>String ID
                  <input value={newString.string_id} onChange={e => setNewString({ ...newString, string_id: e.target.value })} required />
                </label>
                <label>From Value
                  <input value={newString.from_value} onChange={e => setNewString({ ...newString, from_value: e.target.value })} required />
                </label>
              </div>
              <div className="modal-row">
                <label>Status
                  <input value={newString.status} onChange={e => setNewString({ ...newString, status: e.target.value })} required />
                </label>
              </div>
              <div className="modal-row">
                <label>To Values</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {newString.to_values.map((val, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input value={val} onChange={e => setNewString({ ...newString, to_values: newString.to_values.map((v, vIdx) => vIdx === idx ? e.target.value : v) })} />
                      <button className="lm-delete-btn" onClick={() => setNewString({ ...newString, to_values: newString.to_values.filter((_, vIdx) => vIdx !== idx) })}><i className="fa-solid fa-trash"></i></button>
                    </div>
                  ))}
                  {newString.to_values.length < 3 && (
                    <button className="lm-add-btn" onClick={() => setNewString({ ...newString, to_values: [...newString.to_values, ""] })}><i className="fa-solid fa-plus"></i> Add</button>
                  )}
                </div>
              </div>
              <div className="modal-actions">
                <button className="lm-save-btn" onClick={handleAddString}>Save</button>
                <button className="lm-delete-btn" onClick={() => setAddModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <table className="lm-table">
        <thead>
          <tr>
            <th>String ID</th>
            <th>Translation</th>
            <th style={{ textAlign: 'center' }}>Length Check</th>
            <th style={{ textAlign: 'center' }}>Status</th>
            <th></th>
            <th></th>
            <th style={{ textAlign: 'center' }}></th>
          </tr>
        </thead>
        <tbody>
          {pageData.length === 0 ? (
            <tr><td colSpan={7} style={{ textAlign: 'center', color: '#888' }}>No strings found.</td></tr>
          ) : pageData.map((row, rowIdx) => (
            <tr key={row.string_id}>
              <td>{row.string_id}</td>
              <td className="lm-translation-cell" style={{ position: 'relative' }}>
                <div className="lm-translation-row" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 0, position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                    <span className="lm-lang-label" style={{ fontWeight: 500, color: '#1976d2' }}>{fromLanguageName}</span>
                    <span style={{ marginLeft: 8 }}>{row.from_value}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 2 }}>
                    <span className="lm-to-lang-label lm-lang-label" style={{ color: '#1976d2' }}>{toLanguageName}:</span>
                    {row.to_values.map((val, idx) => (
                      <div key={idx} style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                        <input
                          value={val}
                          onChange={e => handleToValueChange((page - 1) * ROWS_PER_PAGE + rowIdx, idx, e.target.value)}
                          className="lm-translation-value"
                          style={{ padding: 2, borderRadius: 4, border: '1px solid #ccc', width: 180 }}
                          onFocus={() => setToValuesEdit({ row: (page - 1) * ROWS_PER_PAGE + rowIdx, idx })}
                          onBlur={() => setToValuesEdit(null)}
                        />
                        <span className="to-value-actions" style={{ display: 'flex', alignItems: 'center', marginLeft: 4, opacity: (toValuesEdit && toValuesEdit.row === (page - 1) * ROWS_PER_PAGE + rowIdx && toValuesEdit.idx === idx) ? 1 : 0, transition: 'opacity 0.2s' }}>
                          <button className="lm-edit-btn" style={{ marginLeft: 2, background: 'transparent', color: '#1976d2', boxShadow: 'none' }}><i className="fa-solid fa-pen"></i></button>
                          <button className="lm-delete-btn" style={{ marginLeft: 2, background: 'transparent', color: '#d32f2f', boxShadow: 'none' }} onMouseDown={e => { e.preventDefault(); handleDeleteToValue((page - 1) * ROWS_PER_PAGE + rowIdx, idx); }}><i className="fa-solid fa-trash"></i></button>
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Menu button at the end of the cell */}
                  <button className="lm-edit-btn" style={{ background: 'transparent', color: '#1976d2', fontSize: 18, padding: 6, position: 'absolute', top: 0, right: 0 }} onClick={() => handleMenuOpen((page - 1) * ROWS_PER_PAGE + rowIdx, 'cell')}>
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                  </button>
                  {menuOpen && menuOpen.row === (page - 1) * ROWS_PER_PAGE + rowIdx && menuOpen.type === 'cell' && (
                    <div style={{ position: 'absolute', right: 0, top: 30, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: 8, zIndex: 10, minWidth: 140, padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }} onMouseLeave={handleMenuClose}>
                      <button className="lm-add-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => { handleAddToValue((page - 1) * ROWS_PER_PAGE + rowIdx); handleMenuClose(); }}><i className="fa-solid fa-plus"></i> Add To-Value</button>
                    </div>
                  )}
                </div>
              </td>
              <td style={{ textAlign: 'center' }}>
                <span className={`lm-dot ${isLengthOk(row.to_values) ? 'green' : 'red'}`}></span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <span>{row.status}</span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <i className="fa-regular fa-comment-dots" style={{ fontSize: 18, color: '#888', cursor: 'pointer' }} title="Comments"></i>
              </td>
              <td style={{ textAlign: 'center' }}>
                <i className="fa-solid fa-clock-rotate-left" style={{ fontSize: 18, color: '#888', cursor: 'pointer' }} title="Activity"></i>
              </td>
              <td style={{ textAlign: 'center', position: 'relative' }}>
                <button className="lm-edit-btn" style={{ background: 'transparent', color: '#1976d2', fontSize: 18, padding: 6 }} onClick={() => handleMenuOpen((page - 1) * ROWS_PER_PAGE + rowIdx, 'row')}>
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>
                {menuOpen && menuOpen.row === (page - 1) * ROWS_PER_PAGE + rowIdx && menuOpen.type === 'row' && (
                  <div style={{ position: 'absolute', right: 0, top: 30, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: 8, zIndex: 10, minWidth: 120, padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }} onMouseLeave={handleMenuClose}>
                    <button className="lm-edit-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => { handleEditRow((page - 1) * ROWS_PER_PAGE + rowIdx); handleMenuClose(); }}><i className="fa-solid fa-pen"></i> Edit</button>
                    <button className="lm-delete-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => { handleDeleteRow((page - 1) * ROWS_PER_PAGE + rowIdx); handleMenuClose(); }}><i className="fa-solid fa-trash"></i> Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="lm-pagination">
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>&lt;</button>
        <span>Page {page} of {totalPages || 1}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages || totalPages === 0}>&gt;</button>
      </div>
    </div>
  );
}