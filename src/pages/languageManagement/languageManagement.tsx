import { useState, useEffect } from "react";
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

// Mock activity data for demo
const MOCK_ACTIVITIES = [
  [
    {
      action: "Translation Option Updated",
      user: "Issac Newton",
      date: "2025-07-04 14:58:14"
    },
    {
      action: "Translation Option Updated",
      user: "Issac Newton",
      date: "2025-06-30 15:46:41"
    }
  ],
  [
    {
      action: "Translation Option Updated",
      user: "Marie Curie",
      date: "2025-07-01 10:12:00"
    }
  ],
  [
    {
      action: "Translation Option Updated",
      user: "Albert Einstein",
      date: "2025-06-28 09:30:00"
    }
  ],
  [
    {
      action: "Translation Option Updated",
      user: "Ada Lovelace",
      date: "2025-07-02 11:22:33"
    }
  ],
  [
    {
      action: "Translation Option Updated",
      user: "Nikola Tesla",
      date: "2025-07-03 17:45:00"
    }
  ]
];

export default function LanuageMangement() {
  const { projectId, variantsId, languageId } = useParams();
  const [rows, setRows] = useState<TranslationRow[]>(initialRows);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState<{ row: number, type: 'cell' | 'row' | `cell-${number}` } | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [newString, setNewString] = useState({ string_id: "", from_value: "", to_values: [""], status: "" });
  const [fromLanguage, setFromLanguage] = useState(LANGUAGE_LIB[0].code);
  const [toValuesEdit, setToValuesEdit] = useState<{ row: number; idx: number } | null>(null);
  const [activityModal, setActivityModal] = useState<{ open: boolean, rowIdx: number | null }>({ open: false, rowIdx: null });
  const [commentModal, setCommentModal] = useState<{ open: boolean, rowIdx: number | null }>({ open: false, rowIdx: null });
  // Update rowComments to store array of {text, user, date}
  type Comment = { text: string; user: string; date: string };
  const [rowComments, setRowComments] = useState<{ [rowIdx: number]: Comment[] }>({});
  const [newComment, setNewComment] = useState("");

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

  const handleMenuOpen = (rowIdx: number, type: 'cell' | 'row' | `cell-${number}`) => setMenuOpen({ row: rowIdx, type });
  const handleMenuClose = () => setMenuOpen(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      const menu = document.getElementById('translation-menu-popover');
      if (menu && !menu.contains(e.target as Node)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const iconBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    borderRadius: 6,
    padding: '4px 6px',
    fontSize: 15,
    color: '#888',
    cursor: 'pointer',
    transition: 'background 0.18s, color 0.18s',
    minWidth: 0
  };

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
              <td className="lm-translation-cell">
                <div style={{ display: 'flex', gap: 16 }}>
                  {/* Left column - Translation content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                      <span className="lm-lang-label" style={{ fontWeight: 500, color: '#1976d2' }}>{fromLanguageName}</span>
                      <span style={{ marginLeft: 8 }}>{row.from_value}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 2 }}>
                      <span className="lm-to-lang-label lm-lang-label" style={{ color: '#1976d2' }}>{toLanguageName}:</span>
                      {row.to_values.map((val, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 2, position: 'relative' }}>
                          <textarea
                            value={val}
                            onChange={e => {
                              if (toValuesEdit && toValuesEdit.row === (page - 1) * ROWS_PER_PAGE + rowIdx && toValuesEdit.idx === idx) {
                                handleToValueChange((page - 1) * ROWS_PER_PAGE + rowIdx, idx, e.target.value);
                                autoResizeTextarea(e.target);
                              }
                            }}
                            className="lm-translation-value"
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #e0e0e0',
                              width: "70%",
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
                            onFocus={e => {
                              setToValuesEdit({ row: (page - 1) * ROWS_PER_PAGE + rowIdx, idx });
                              e.target.style.borderColor = '#1976d2';
                              e.target.style.backgroundColor = '#ffffff';
                              e.target.style.boxShadow = '0 2px 8px rgba(25, 118, 210, 0.15)';
                            }}
                            onBlur={e => {
                              setToValuesEdit(null);
                              e.target.style.borderColor = '#e0e0e0';
                              e.target.style.backgroundColor = '#fafafa';
                              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                            }}
                            rows={1}
                            ref={el => {
                              if (el) {
                                autoResizeTextarea(el);
                              }
                            }}
                            readOnly={!(toValuesEdit && toValuesEdit.row === (page - 1) * ROWS_PER_PAGE + rowIdx && toValuesEdit.idx === idx)}
                          />
                          <span className={`lm-dot ${getLengthChecks(row.to_values)[idx] ? 'green' : 'red'}`} style={{ marginLeft: 16, marginRight: 8, alignSelf: 'center' }}></span>
                          {/* Menu button for each textarea */}
                          <div style={{ position: 'relative', marginLeft: 8 }}>
                            <button
                              className="lm-edit-btn"
                              style={{
                                background: 'transparent',
                                color: '#1976d2',
                                fontSize: 18,
                                padding: 4,
                                border: 'none',
                                cursor: 'pointer'
                              }}
                              onClick={() => setMenuOpen({ row: (page - 1) * ROWS_PER_PAGE + rowIdx, type: `cell-${idx}` as any })}
                            >
                              <i className="fa-solid fa-bars"></i>
                            </button>
                            {menuOpen && menuOpen.row === (page - 1) * ROWS_PER_PAGE + rowIdx && menuOpen.type === `cell-${idx}` && (
                              <div
                                id="translation-menu-popover"
                                style={{
                                  position: 'absolute',
                                  left: '110%',
                                  top: 0,
                                  background: 'linear-gradient(135deg, #f8fafc 0%, #e3f0ff 100%)',
                                  boxShadow: '0 4px 16px rgba(25, 118, 210, 0.10)',
                                  border: '1px solid #e3e8ee',
                                  borderRadius: 10,
                                  zIndex: 10,
                                  minWidth: 0,
                                  padding: '4px 6px',
                                  display: 'flex',
                                  flexDirection: 'row', // horizontal
                                  gap: 4,
                                  alignItems: 'center',
                                  animation: 'fadeInMenu 0.25s ease'
                                }}
                              >
                                <button title="Delete" style={iconBtnStyle} onClick={() => {
                                  handleDeleteToValue((page - 1) * ROWS_PER_PAGE + rowIdx, idx);
                                  handleMenuClose();
                                }}><i className="fa-solid fa-trash"></i></button>
                                <button title="Approve" style={{...iconBtnStyle, color: '#388e3c'}} onClick={() => {
                                  setRows(rows =>
                                    rows.map((row, rIdx) =>
                                      rIdx === (page - 1) * ROWS_PER_PAGE + rowIdx
                                        ? { ...row, status: 'Approved' }
                                        : row
                                    )
                                  );
                                  handleMenuClose();
                                }}><i className="fa-solid fa-check-circle"></i></button>
                                <button title="Reject" style={{...iconBtnStyle, color: '#f44336'}} onClick={() => {
                                  setRows(rows =>
                                    rows.map((row, rIdx) =>
                                      rIdx === (page - 1) * ROWS_PER_PAGE + rowIdx
                                        ? { ...row, status: 'Rejected' }
                                        : row
                                    )
                                  );
                                  handleMenuClose();
                                }}><i className="fa-solid fa-times-circle"></i></button>
                                <button title="Clear" style={{...iconBtnStyle, color: '#1976d2'}} onClick={() => {
                                  handleToValueChange((page - 1) * ROWS_PER_PAGE + rowIdx, idx, "");
                                  handleMenuClose();
                                }}><i className="fa-solid fa-eraser"></i></button>
                                <button title="Edit" style={{...iconBtnStyle, color: '#1976d2'}} onClick={() => {
                                  setToValuesEdit({ row: (page - 1) * ROWS_PER_PAGE + rowIdx, idx });
                                  handleMenuClose();
                                }}><i className="fa-solid fa-pen"></i></button>
                                <button title="Suggest" style={{...iconBtnStyle, color: '#FFD600'}} onClick={() => {
                                  alert("Show suggestions for: " + val);
                                  handleMenuClose();
                                }}><i className="fa-solid fa-lightbulb"></i></button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Right column - Menu button */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 40, position: 'relative' }}>
                    <button 
                      className="lm-edit-btn" 
                      style={{ 
                        background: 'transparent', 
                        color: '#1976d2', 
                        fontSize: 18, 
                        padding: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }} 
                      onClick={() => handleMenuOpen((page - 1) * ROWS_PER_PAGE + rowIdx, 'cell')}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                    {menuOpen && menuOpen.row === (page - 1) * ROWS_PER_PAGE + rowIdx && menuOpen.type === 'cell' && (
                      <div style={{ 
                        position: 'absolute', 
                        right: 0, 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        background: '#fff', 
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
                        borderRadius: 8, 
                        zIndex: 10, 
                        minWidth: 140, 
                        padding: 8, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 6 
                      }} onMouseLeave={handleMenuClose}>
                        <button className="lm-add-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => { handleAddToValue((page - 1) * ROWS_PER_PAGE + rowIdx); handleMenuClose(); }}><i className="fa-solid fa-plus"></i> Add To-Value</button>
                      </div>
                    )}
                  </div>
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
                  <i
                    className="fa-regular fa-comment-dots"
                    style={{ fontSize: 18, color: '#888', cursor: 'pointer' }}
                    title="Comments"
                    onClick={() => {
                      setCommentModal({ open: true, rowIdx: (page - 1) * ROWS_PER_PAGE + rowIdx });
                      setNewComment("");
                    }}
                  ></i>
                  <i
                    className="fa-solid fa-clock-rotate-left"
                    style={{ fontSize: 18, color: '#888', cursor: 'pointer' }}
                    title="Activity"
                    onClick={() => setActivityModal({ open: true, rowIdx: (page - 1) * ROWS_PER_PAGE + rowIdx })}
                  ></i>
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
      {activityModal.open && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-content modal-content-smooth" style={{ minWidth: 380, maxWidth: 420, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px 12px 24px', borderBottom: '1px solid #eee', fontWeight: 600, fontSize: 18 }}>Activities</div>
            <div style={{ padding: 24, background: '#fafbfc', minHeight: 180 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {(MOCK_ACTIVITIES[activityModal.rowIdx ?? 0] || []).map((act, idx, arr) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
                    {/* Timeline dot and line */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 16, minWidth: 18 }}>
                      <span style={{
                        width: 12, height: 12, borderRadius: 6, background: '#4fd1c5', border: '2px solid #fff', boxShadow: '0 0 0 2px #4fd1c5', marginBottom: 2
                      }}></span>
                      {idx !== arr.length - 1 && (
                        <span style={{ width: 2, flex: 1, background: '#e0f7fa', minHeight: 24 }}></span>
                      )}
                    </div>
                    {/* Activity content */}
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 2 }}>{act.action}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{ background: '#f3f6f9', color: '#1976d2', borderRadius: 6, padding: '2px 8px', fontSize: 13, fontWeight: 500, letterSpacing: 0.2 }}>{act.user}</span>
                      </div>
                      <div style={{ color: '#888', fontSize: 13 }}>{act.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: 16, textAlign: 'right', borderTop: '1px solid #eee', background: '#fff' }}>
              <button className="lm-add-btn" style={{ minWidth: 80 }} onClick={() => setActivityModal({ open: false, rowIdx: null })}>Close</button>
            </div>
          </div>
        </div>
      )}
      {commentModal.open && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-content modal-content-smooth" style={{ minWidth: 380, maxWidth: 420, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px 12px 24px', borderBottom: '1px solid #eee', fontWeight: 600, fontSize: 18 }}>Comments</div>
            <div style={{ padding: 24, background: '#fafbfc', minHeight: 120 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Show previous comments */}
                {(rowComments[commentModal.rowIdx ?? -1] || []).length === 0 && (
                  <div style={{ color: '#888', fontSize: 14, textAlign: 'center' }}>No comments yet.</div>
                )}
                {(rowComments[commentModal.rowIdx ?? -1] || []).map((c, idx) => (
                  <div key={idx} style={{ background: '#fff', borderRadius: 8, padding: '10px 14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: 2 }}>
                    <div style={{ fontSize: 15, marginBottom: 4 }}>{c.text}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#888' }}>
                      <span style={{ background: '#f3f6f9', color: '#1976d2', borderRadius: 6, padding: '2px 8px', fontWeight: 500 }}> {c.user} </span>
                      <span>{c.date}</span>
                    </div>
                  </div>
                ))}
                {/* New comment input */}
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #e0e0e0',
                    minHeight: 48,
                    fontFamily: 'inherit',
                    fontSize: 14,
                    background: '#fff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'all 0.2s'
                  }}
                />
              </div>
            </div>
            <div style={{ padding: 16, textAlign: 'right', borderTop: '1px solid #eee', background: '#fff', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="lm-add-btn" style={{ minWidth: 80 }} onClick={() => setCommentModal({ open: false, rowIdx: null })}>Cancel</button>
              <button className="lm-save-btn" style={{ minWidth: 80 }} disabled={!newComment.trim()} onClick={() => {
                if (commentModal.rowIdx !== null && newComment.trim()) {
                  const now = new Date();
                  const dateStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0') + ' ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0') + ':' + String(now.getSeconds()).padStart(2,'0');
                  setRowComments(prev => ({
                    ...prev,
                    [commentModal.rowIdx!]: [
                      ...(prev[commentModal.rowIdx!] || []),
                      { text: newComment, user: 'You', date: dateStr }
                    ]
                  }));
                }
                setCommentModal({ open: false, rowIdx: null });
              }}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}