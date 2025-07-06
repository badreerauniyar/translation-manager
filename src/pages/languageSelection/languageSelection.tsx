import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./langaugeSelection.css"

interface Language {
    countryName: string;
    countryCode: string;
    languageName: string;
    languageCode: string;
    progress: number;
    totalTexts: number;
}

interface LanguageModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (lang: Language) => void;
    initial: Language | null;
    mode: "add" | "edit";
}

interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

const initialLanguages: Language[] = [
    {
        countryName: "United Arab Emirates",
        countryCode: "AE",
        languageName: "العربية (Arabic)",
        languageCode: "UAE",
        progress: 71,
        totalTexts: 42,
    },
    {
        countryName: "Spain",
        countryCode: "ES",
        languageName: "Català (Catalan)",
        languageCode: "ES",
        progress: 50,
        totalTexts: 42,
    },
    {
        countryName: "France",
        countryCode: "FR",
        languageName: "Français (French)",
        languageCode: "FR",
        progress: 85,
        totalTexts: 42,
    },
    {
        countryName: "Germany",
        countryCode: "DE",
        languageName: "Deutsch (German)",
        languageCode: "DE",
        progress: 92,
        totalTexts: 42,
    },
    {
        countryName: "Italy",
        countryCode: "IT",
        languageName: "Italiano (Italian)",
        languageCode: "IT",
        progress: 68,
        totalTexts: 42,
    },
    {
        countryName: "Japan",
        countryCode: "JP",
        languageName: "日本語 (Japanese)",
        languageCode: "JP",
        progress: 35,
        totalTexts: 42,
    },
];

const ROWS_PER_PAGE = 5;

function LanguageModal({ open, onClose, onSave, initial, mode }: LanguageModalProps) {
    const [form, setForm] = useState<Language>(
        initial || { countryName: "", countryCode: "", languageName: "", languageCode: "", progress: 0, totalTexts: 0 }
    );
    useEffect(() => {
        if (initial) setForm(initial);
    }, [initial]);
    if (!open) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content modal-content-smooth">
                <h3 style={{ marginBottom: 8 }}>{mode === "add" ? "Add New Language" : "Edit Language"}</h3>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        onSave(form);
                    }}
                    className="modal-form-smooth"
                >
                    <div className="modal-row">
                        <label>Country Name
                            <input value={form.countryName} onChange={e => setForm({ ...form, countryName: e.target.value })} required />
                        </label>
                        <label>Country Code
                            <input value={form.countryCode} maxLength={2} onChange={e => setForm({ ...form, countryCode: e.target.value.toUpperCase() })} required />
                        </label>
                    </div>
                    <div className="modal-row">
                        <label>Language Name
                            <input value={form.languageName} onChange={e => setForm({ ...form, languageName: e.target.value })} required />
                        </label>
                        <label>Language Code
                            <input value={form.languageCode} maxLength={3} onChange={e => setForm({ ...form, languageCode: e.target.value.toUpperCase() })} required />
                        </label>
                    </div>
                    <div className="modal-row">
                        <label>Progress (%)
                            <input type="number" min={0} max={100} value={form.progress} onChange={e => setForm({ ...form, progress: Number(e.target.value) })} required />
                        </label>
                        <label>Total Texts
                            <input type="number" min={0} value={form.totalTexts} onChange={e => setForm({ ...form, totalTexts: Number(e.target.value) })} required />
                        </label>
                    </div>
                    <div className="modal-actions">
                        <button type="submit">{mode === "add" ? "Add" : "Save"}</button>
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
            <i
                className="fa-solid fa-magnifying-glass searchbox-icon"
                onClick={() => setFocused(true)}
                style={{ cursor: 'pointer' }}
            ></i>
            <input
                ref={inputRef}
                type="text"
                className="searchbox-input"
                placeholder="Search by language, country code, or language code..."
                value={value}
                onChange={e => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
            {value && (
                <button
                    className="searchbox-clear"
                    onClick={() => { onChange(""); inputRef.current?.focus(); }}
                    tabIndex={-1}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            )}
        </div>
    );
}

export function LanguageSelection() {
    const { projectId, variantsId } = useParams();
    const navigate = useNavigate();
    const [languages, setLanguages] = useState<Language[]>(initialLanguages);
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");
    const [menuOpen, setMenuOpen] = useState<number | null>(null); // index of open menu
    const [modal, setModal] = useState<{ open: boolean; mode: "add" | "edit"; lang: Language | null }>({ open: false, mode: "add", lang: null });
    const [confirm, setConfirm] = useState<{ open: boolean; lang: Language | null }>({ open: false, lang: null });
    const [showInfo, setShowInfo] = useState<boolean>(false);

    // Filtered and paginated data
    const filtered = languages.filter(l =>
        l.languageName.toLowerCase().includes(search.toLowerCase()) ||
        l.countryCode.toLowerCase().includes(search.toLowerCase()) ||
        l.languageCode.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
    const startIdx = (page - 1) * ROWS_PER_PAGE;
    const pageData = filtered.slice(startIdx, startIdx + ROWS_PER_PAGE);

    // Menu handlers
    const handleMenu = (idx: number) => setMenuOpen(menuOpen === idx ? null : idx);
    const closeMenu = () => setMenuOpen(null);

    // Modal handlers
    const openAdd = () => setModal({ open: true, mode: "add", lang: null });
    const openEdit = (lang: Language) => setModal({ open: true, mode: "edit", lang });
    const closeModal = () => setModal({ open: false, mode: "add", lang: null });
    const handleSave = (lang: Language) => {
        if (modal.mode === "add") {
            setLanguages([...languages, lang]);
        } else {
            setLanguages(languages.map(l => (l.languageCode === modal.lang?.languageCode ? lang : l)));
        }
        closeModal();
    };
    // Delete handlers
    const openDelete = (lang: Language) => setConfirm({ open: true, lang });
    const closeConfirm = () => setConfirm({ open: false, lang: null });
    const handleDelete = () => {
        setLanguages(languages.filter(l => l.languageCode !== confirm.lang?.languageCode));
        closeConfirm();
    };

    return (
        <div className="lang-mgmt-container">
            <div style={{marginBottom: 16, color: '#1976d2', fontWeight: 500}}>
                Project ID: {projectId} &nbsp;|&nbsp; Variant ID: {variantsId}
            </div>
            <div className="lang-mgmt-header-flex">
                <div className="lang-mgmt-header-left">
                    <h2>Language Selection</h2>
                    <i
                        className="fa-solid fa-circle-question info-icon"
                        title="Manage and track all your translation languages here."
                        onClick={() => setShowInfo(true)}
                        style={{ cursor: 'pointer', marginLeft: 8 }}
                    ></i>
                </div>
                <div className="lang-mgmt-header-right">
                    <i className="fa-solid fa-rotate" style={{ cursor: 'pointer', marginRight: 12 }}></i>
                    <SearchBox value={search} onChange={v => { setSearch(v); setPage(1); }} />
                    <button className="add-lang-btn" onClick={openAdd}>+ Add new language</button>
                </div>
            </div>
            {showInfo && (
                <div className="info-modal-overlay" onClick={() => setShowInfo(false)}>
                    <div className="info-modal-content" onClick={e => e.stopPropagation()}>
                        <h3>About Language Management</h3>
                        <p>Manage and track all your translation languages here. You can add, edit, delete, and monitor the progress of each language.</p>
                        <button onClick={() => setShowInfo(false)}>Close</button>
                    </div>
                </div>
            )}
            <table className="lang-mgmt-table">
                <thead>
                    <tr>
                        <th>COUNTRY</th>
                        <th>LANGUAGE</th>
                        <th>PROGRESS</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {pageData.map((row, idx) => (
                        <tr key={row.languageCode} style={{ cursor: 'pointer' }} onClick={e => {
                            if ((e.target as HTMLElement).tagName === 'BUTTON') return;
                            navigate(`/languagemanagement/${projectId}/${variantsId}/${row.languageCode}`);
                          }}>
                            <td>
                                <span>
                                    <img
                                        src={`https://flagcdn.com/16x12/${row.countryCode.toLowerCase()}.png`}
                                        width="16"
                                        height="12"
                                        alt={`Flag of ${row.countryName}`}
                                        style={{ marginRight: 8 }}
                                    />
                                </span>
                                <span className="country-code">{row.countryCode}</span>
                            </td>
                            <td>
                                <span className="lang-code">{row.languageCode}</span> {row.languageName}
                            </td>
                            <td>
                                <div className="progress-bar-bg">
                                    <div
                                        className="progress-bar-fill"
                                        style={{ width: `${row.progress}%`, background: row.progress >= 80 ? '#20c997' : row.progress >= 50 ? '#ffc107' : '#fd7e14' }}
                                    ></div>
                                </div>
                                <span style={{ marginLeft: 8 }}>{row.progress}%</span>
                            </td>
                            <td style={{ position: "relative" }}>
                                <span className="dot-green" /> {row.totalTexts} Total text(s) &nbsp;
                                <a href="#" className="ref-link">Mark as Reference</a>
                                <button className="menu-btn" onClick={e => { e.stopPropagation(); handleMenu(idx); }}>
                                    &#8942;
                                </button>
                                {menuOpen === idx && (
                                    <div className="menu-dropdown" onMouseLeave={closeMenu}>
                                        <button onClick={() => { openEdit(row); closeMenu(); }}>Edit</button>
                                        <button onClick={() => { openDelete(row); closeMenu(); }}>Delete</button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    {pageData.length === 0 && (
                        <tr><td colSpan={4} style={{ textAlign: "center" }}>No languages found.</td></tr>
                    )}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>&lt;</button>
                <span>Page {page} of {totalPages || 1}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}>&gt;</button>
            </div>
            <LanguageModal
                open={modal.open}
                onClose={closeModal}
                onSave={handleSave}
                initial={modal.mode === "edit" ? modal.lang : null}
                mode={modal.mode}
            />
            <ConfirmModal
                open={confirm.open}
                onClose={closeConfirm}
                onConfirm={handleDelete}
                message={`Are you sure you want to delete ${confirm.lang?.languageName}?`}
            />
        </div>
    );
}
