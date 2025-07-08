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
  {
    string_id: "STR004",
    from_value: "Welcome to our application",
    to_values: ["Bienvenue dans notre application", "Bienvenue à notre app"],
    status: "In Progress",
  },
  {
    string_id: "STR005",
    from_value: "Error occurred",
    to_values: ["Une erreur s'est produite"],
    status: "Rejected",
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

  // Auto-resize textarea function
  const autoResizeTextarea = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
  };

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
  // Length check: returns array of boolean values for each translation
  const getLengthChecks = (vals: string[]) => vals.map(val => val.length <= 50);

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
            <th style={{ textAlign: 'center' }}>Status</th>
            <th style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageData.length === 0 ? (
            <tr><td colSpan={4} style={{ textAlign: 'center', color: '#888' }}>No strings found.</td></tr>
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
                      <div key={idx} style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', marginBottom: 2 }}>
                        <textarea
                          value={val}
                          onChange={e => {
                            handleToValueChange((page - 1) * ROWS_PER_PAGE + rowIdx, idx, e.target.value);
                            autoResizeTextarea(e.target);
                          }}
                          className="lm-translation-value"
                          style={{ 
                            padding: '8px 12px', 
                            borderRadius: '8px', 
                            border: '1px solid #e0e0e0', 
                            width: 180, 
                            minHeight: 24,
                            resize: 'none',
                            fontFamily: 'inherit',
                            fontSize: '14px',
                            lineHeight: '1.4',
                            overflow: 'hidden',
                            backgroundColor: '#fafafa',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            outline: 'none'
                          }}
                          onFocus={(e) => {
                            setToValuesEdit({ row: (page - 1) * ROWS_PER_PAGE + rowIdx, idx });
                            e.target.style.borderColor = '#1976d2';
                            e.target.style.backgroundColor = '#ffffff';
                            e.target.style.boxShadow = '0 2px 8px rgba(25, 118, 210, 0.15)';
                          }}
                          onBlur={(e) => {
                            setToValuesEdit(null);
                            e.target.style.borderColor = '#e0e0e0';
                            e.target.style.backgroundColor = '#fafafa';
                            e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                          }}
                          rows={1}
                          ref={(el) => {
                            if (el) {
                              autoResizeTextarea(el);
                            }
                          }}
                        />
                        <span className={`lm-dot ${getLengthChecks(row.to_values)[idx] ? 'green' : 'red'}`} style={{ marginLeft: 12, marginRight: 4, alignSelf: 'center' }}></span>
                        <span className="to-value-actions" style={{ display: 'flex', alignItems: 'flex-start', marginLeft: 4, marginTop: 4, opacity: (toValuesEdit && toValuesEdit.row === (page - 1) * ROWS_PER_PAGE + rowIdx && toValuesEdit.idx === idx) ? 1 : 0, transition: 'opacity 0.2s' }}>
                          <button className="lm-edit-btn" style={{ marginLeft: 2, background: 'transparent', color: '#1976d2', boxShadow: 'none' }}><i className="fa-solid fa-pen"></i></button>
                          <button className="lm-delete-btn" style={{ marginLeft: 2, background: 'transparent', color: '#d32f2f', boxShadow: 'none' }} onMouseDown={e => { e.preventDefault(); handleDeleteToValue((page - 1) * ROWS_PER_PAGE + rowIdx, idx); }}><i className="fa-solid fa-trash"></i></button>
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Menu button at the end of the cell */}
                  <button className="lm-edit-btn" style={{ background: 'transparent', color: '#1976d2', fontSize: 18, padding: 6, position: 'absolute', top: 44, right: 0 }} onClick={() => handleMenuOpen((page - 1) * ROWS_PER_PAGE + rowIdx, 'cell')}>
                    <i className="fa-solid fa-bars"></i>
                  </button>
                  {menuOpen && menuOpen.row === (page - 1) * ROWS_PER_PAGE + rowIdx && menuOpen.type === 'cell' && (
                    <div style={{ position: 'absolute', right: 0, top: 30, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: 8, zIndex: 10, minWidth: 140, padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }} onMouseLeave={handleMenuClose}>
                      <button className="lm-add-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => { handleAddToValue((page - 1) * ROWS_PER_PAGE + rowIdx); handleMenuClose(); }}><i className="fa-solid fa-plus"></i> Add To-Value</button>
                    </div>
                  )}
                </div>
              </td>

              <td style={{ textAlign: 'center' }}>
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '6px',
                  color: row.status === 'Pending' ? '#ff9800' : 
                         row.status === 'In Progress' ? '#1976d2' : 
                         (row.status === 'Resolved' || row.status === 'Approved') ? '#4caf50' : 
                         row.status === 'Rejected' ? '#f44336' : '#666'
                }}>
                  <i className={`fas ${
                    row.status === 'Pending' ? 'fa-clock' : 
                    row.status === 'In Progress' ? 'fa-spinner fa-spin' : 
                    (row.status === 'Resolved' || row.status === 'Approved') ? 'fa-check-circle' : 
                    row.status === 'Rejected' ? 'fa-times-circle' : 'fa-circle'
                  }`}></i>
                  {row.status}
                </span>
              </td>
              <td style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%', minHeight: 80 }}>
                  <i className="fa-regular fa-comment-dots" style={{ fontSize: 18, color: '#888', cursor: 'pointer' }} title="Comments"></i>
                  <i className="fa-solid fa-clock-rotate-left" style={{ fontSize: 18, color: '#888', cursor: 'pointer' }} title="Activity"></i>
                  {/* <button className="lm-edit-btn" style={{ background: 'transparent', color: '#1976d2', fontSize: 18, padding: 6 }} onClick={() => handleMenuOpen((page - 1) * ROWS_PER_PAGE + rowIdx, 'row')}> */}
                    {/* <i className="fa-solid fa-ellipsis-vertical"></i> */}
                    <i className="fas fa-bars" style={{ fontSize: 18, color: '#888', cursor: 'pointer' }} title="Menu" onClick={() => handleMenuOpen((page - 1) * ROWS_PER_PAGE + rowIdx, 'row')}></i>
                  {/* </button> */}
                </div>
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