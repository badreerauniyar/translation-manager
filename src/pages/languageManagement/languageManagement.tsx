import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./languageManagement.css";
const FROM_LANGUAGES = ["en", "fr", "de", "es"];
const STATUS_OPTIONS = ["Pending", "Approved", "Rejected"];
const ROWS_PER_PAGE = 5;


interface TranslationRow {
  string_id: string;
  from_language: string;
  from_value: string;
  to_values: string[];
  status: string;
}

const initialRows: TranslationRow[] = [
  {
    string_id: "STR001",
    from_language: "en",
    from_value: "Hello World!",
    to_values: ["Bonjour le monde!", "Salut tout le monde!"],
    status: "Pending",
  },
  {
    string_id: "STR002",
    from_language: "en",
    from_value: "Goodbye!",
    to_values: ["Au revoir!"],
    status: "Approved",
  },
  {
    string_id: "STR003",
    from_language: "fr",
    from_value: "Merci",
    to_values: ["Thank you", "Thanks", "Thx"],
    status: "Pending",
  },
  // ...more rows
];

export default function LanuageMangement() {
  const { projectId, variantsId, languageId } = useParams();
  const [rows, setRows] = useState<TranslationRow[]>(initialRows);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromLangFilter, setFromLangFilter] = useState("");
  const [page, setPage] = useState(1);
  const [editIdx, setEditIdx] = useState<{row: number, idx: number} | null>(null);
  const [editValue, setEditValue] = useState("");

  // Filtering
  let filtered = rows.filter(row =>
    (row.string_id.toLowerCase().includes(search.toLowerCase()) ||
     row.from_value.toLowerCase().includes(search.toLowerCase()) ||
     row.to_values.some(val => val.toLowerCase().includes(search.toLowerCase()))) &&
    (!statusFilter || row.status === statusFilter) &&
    (!fromLangFilter || row.from_language === fromLangFilter)
  );
  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const pageData = filtered.slice((page-1)*ROWS_PER_PAGE, page*ROWS_PER_PAGE);

  // Handlers
  const handleFromLangChange = (rowIdx: number, lang: string) => {
    setRows(rows => rows.map((row, idx) => idx === rowIdx ? { ...row, from_language: lang } : row));
  };
  const handleAddToValue = (rowIdx: number) => {
    setRows(rows => rows.map((row, idx) => idx === rowIdx ? { ...row, to_values: [...row.to_values, ""] } : row));
    setEditIdx({row: rowIdx, idx: rows[rowIdx].to_values.length});
    setEditValue("");
  };
  const handleEditToValue = (rowIdx: number, idx: number) => {
    setEditIdx({row: rowIdx, idx});
    setEditValue(rows[rowIdx].to_values[idx]);
  };
  const handleSaveToValue = (rowIdx: number, idx: number) => {
    setRows(rows => rows.map((row, rIdx) => rIdx === rowIdx ? {
      ...row,
      to_values: row.to_values.map((val, vIdx) => vIdx === idx ? editValue : val)
    } : row));
    setEditIdx(null);
    setEditValue("");
  };
  const handleDeleteToValue = (rowIdx: number, idx: number) => {
    setRows(rows => rows.map((row, rIdx) => rIdx === rowIdx ? {
      ...row,
      to_values: row.to_values.filter((_, vIdx) => vIdx !== idx)
    } : row));
  };
  const handleStatusChange = (rowIdx: number, status: string) => {
    setRows(rows => rows.map((row, idx) => idx === rowIdx ? { ...row, status } : row));
  };
  // Length check: green if all to_values <= 50 chars, else red
  const isLengthOk = (vals: string[]) => vals.every(val => val.length <= 50);

  // Pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  // Reset page on filter/search
  React.useEffect(() => { setPage(1); }, [search, statusFilter, fromLangFilter]);

  return (
    <div className="lm-container">
      <h1 className="lm-header">Language Management</h1>
      <div className="lm-header" style={{fontWeight: 500, fontSize: 16, marginBottom: 16}}>
        Project ID: {projectId} | Variant ID: {variantsId} | To Language: {languageId}
      </div>
      <div className="lm-filters">
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <select value={fromLangFilter} onChange={e => setFromLangFilter(e.target.value)}>
          <option value="">All From Languages</option>
          {FROM_LANGUAGES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <table className="lm-table">
        <thead>
          <tr>
            <th>String ID</th>
            <th>Translation</th>
            <th style={{textAlign: 'center'}}>Length Check</th>
            <th style={{textAlign: 'center'}}>Status</th>
            <th style={{textAlign: 'center'}}>Menu</th>
          </tr>
        </thead>
        <tbody>
          {pageData.length === 0 ? (
            <tr><td colSpan={5} style={{textAlign: 'center', color: '#888'}}>No strings found.</td></tr>
          ) : pageData.map((row, rowIdx) => (
            <tr key={row.string_id}>
              <td>{row.string_id}</td>
              <td className="lm-translation-cell">
                <div className="lm-translation-row">
                  <select className="lm-translation-dropdown" value={row.from_language} onChange={e => handleFromLangChange((page-1)*ROWS_PER_PAGE+rowIdx, e.target.value)}>
                    {FROM_LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                  </select>
                  <span className="lm-translation-value">{row.from_value}</span>
                </div>
                <div className="lm-translation-row" style={{marginTop: 6}}>
                  <span className="lm-to-lang-label">To ({languageId}):</span>
                  {row.to_values.map((val, idx) => (
                    <span key={idx} className="lm-to-lang-value">
                      {editIdx && editIdx.row === (page-1)*ROWS_PER_PAGE+rowIdx && editIdx.idx === idx ? (
                        <>
                          <input value={editValue} onChange={e => setEditValue(e.target.value)} style={{padding: 2, borderRadius: 4, border: '1px solid #ccc', width: 120}} />
                          <button className="lm-save-btn" onClick={() => handleSaveToValue((page-1)*ROWS_PER_PAGE+rowIdx, idx)} style={{marginLeft: 2}}>Save</button>
                        </>
                      ) : (
                        <>
                          <span style={{marginRight: 2}}>{val}</span>
                          <button className="lm-edit-btn" onClick={() => handleEditToValue((page-1)*ROWS_PER_PAGE+rowIdx, idx)} style={{marginLeft: 2}}>Edit</button>
                        </>
                      )}
                      <button className="lm-delete-btn" onClick={() => handleDeleteToValue((page-1)*ROWS_PER_PAGE+rowIdx, idx)} style={{marginLeft: 2}}>Delete</button>
                    </span>
                  ))}
                  {row.to_values.length < 3 && (
                    <button className="lm-add-btn" onClick={() => handleAddToValue((page-1)*ROWS_PER_PAGE+rowIdx)} style={{marginLeft: 8}}>Add</button>
                  )}
                </div>
              </td>
              <td style={{textAlign: 'center'}}>
                <span className={`lm-dot ${isLengthOk(row.to_values) ? 'green' : 'red'}`}></span>
              </td>
              <td style={{textAlign: 'center'}}>
                <select className="lm-status-select" value={row.status} onChange={e => handleStatusChange((page-1)*ROWS_PER_PAGE+rowIdx, e.target.value)}>
                  {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </td>
              <td style={{textAlign: 'center'}}>
                <button>Menu</button>
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