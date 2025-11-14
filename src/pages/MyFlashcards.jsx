import React, { useState, useEffect, useRef } from "react";
import "../css/myFlashcards.css";
import "../css/nav.css";

const API = "http://localhost:5000/api";

function MyFlashcards() {
  const user = JSON.parse(localStorage.getItem("user"));

  // STATES
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [flippedIndex, setFlippedIndex] = useState(null);
  const [error, setError] = useState("");
  const [sidebarActive, setSidebarActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Detect sidebar open/close
  useEffect(() => {
    const checkSidebar = () => {
      const sidebar = document.querySelector(".nav-menu");
      setSidebarActive(sidebar?.classList.contains("active") || false);
    };
    checkSidebar();
    const interval = setInterval(checkSidebar, 100);
    return () => clearInterval(interval);
  }, []);

  // Load folders on mount
  useEffect(() => {
    if (user?._id) loadFolders();
  }, [user?._id]);

  // ---------------------------
  // LOAD FOLDERS FROM DATABASE
  // ---------------------------
  const loadFolders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/folders/${user._id}`);
      const data = await res.json();
      setFolders(data);
    } catch (err) {
      console.error("Error loading folders", err);
    }
    setLoading(false);
  };

  // Open a folder
  const openFolder = (id) => {
    const folder = folders.find((f) => f._id === id);
    setSelectedFolder(folder || null);
    setShowForm(false);
    setError("");
  };

  // ---------------------------
  // CREATE FOLDER
  // ---------------------------
  const handleCreateFolder = () => {
    setShowFolderForm(true);
    setNewFolderName("");
    setError("");
  };

  const handleSaveFolder = async () => {
    const name = newFolderName.trim();
    if (!name) {
      setError("Folder name cannot be empty!");
      return;
    }

    try {
      await fetch(`${API}/folders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, name }),
      });

      await loadFolders();
      setShowFolderForm(false);
    } catch (err) {
      console.error(err);
      setError("Error creating folder.");
    }
  };

  // Delete folder
  const handleDeleteFolder = async (id) => {
    if (!window.confirm("Delete this folder and all its flashcards?")) return;

    try {
      await fetch(`${API}/folders/${id}`, { method: "DELETE" });
      await loadFolders();
      setSelectedFolder(null);
    } catch {
      setError("Error deleting folder");
    }
  };

  // ---------------------------
  // FLASHCARDS: ADD / EDIT
  // ---------------------------
  const handleAddClick = () => {
    setQuestion("");
    setAnswer("");
    setEditIndex(null);
    setShowForm(true);
  };

  const handleSaveFlashcard = async () => {
    if (!question.trim() || !answer.trim()) {
      setError("Please fill out both fields!");
      return;
    }

    const folderId = selectedFolder._id;

    try {
      if (editIndex !== null) {
        // EDIT
        await fetch(`${API}/flashcards/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            folderId,
            index: editIndex,
            question,
            answer,
          }),
        });
      } else {
        // ADD
        await fetch(`${API}/flashcards/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            folderId,
            question,
            answer,
          }),
        });
      }

      await refreshSelectedFolder();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Error saving flashcard");
    }
  };

  // EDIT
  const handleEditFlashcard = (index) => {
    const card = selectedFolder.flashcards[index];
    setQuestion(card.question);
    setAnswer(card.answer);
    setEditIndex(index);
    setShowForm(true);
  };

  // DELETE
  const handleDeleteFlashcard = async (index) => {
    try {
      await fetch(`${API}/flashcards/delete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderId: selectedFolder._id, index }),
      });
      await refreshSelectedFolder();
    } catch (err) {
      console.error(err);
      setError("Error deleting flashcard");
    }
  };

  // ---------------------------
  // REFRESH SELECTED FOLDER (IMPORTANT FIX)
  // ---------------------------
  const refreshSelectedFolder = async () => {
    const updated = await (await fetch(`${API}/folders/${user._id}`)).json();
    const newFolder = updated.find((f) => f._id === selectedFolder._id);
    setFolders(updated);
    setSelectedFolder(newFolder);
  };

  // ---------------------------
  // CSV IMPORT
  // ---------------------------
  const handleImportClick = () => {
    if (!selectedFolder) return alert("Open a folder first.");
    fileInputRef.current?.click();
  };

  // robust parser and import handler (replace existing parseCSV and handleFileUpload)

  const parseCSV = (content) => {
    // split lines handling CRLF, remove empty rows
    const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return [];

    // If first line looks like header (contains "question" or "question,answer"), drop it
    const firstLower = lines[0].toLowerCase();
    if (firstLower.includes("question") && firstLower.includes("answer")) {
      lines.shift();
    }

    const cards = [];
    // Use a simple CSV row parser that supports quoted fields with commas
    const parseRow = (row) => {
      const result = [];
      let cur = "";
      let inQuotes = false;
      for (let i = 0; i < row.length; i++) {
        const ch = row[i];
        if (ch === '"' ) {
          // peek next char to handle escaped quotes ""
          if (inQuotes && row[i+1] === '"') {
            cur += '"';
            i++; // skip next quote
          } else {
            inQuotes = !inQuotes;
          }
        } else if (ch === ',' && !inQuotes) {
          result.push(cur);
          cur = "";
        } else {
          cur += ch;
        }
      }
      result.push(cur);
      return result;
    };

    for (let line of lines) {
      const parts = parseRow(line);
      if (parts.length >= 2) {
        const q = parts[0].trim().replace(/^"|"$/g, "");
        const a = parts.slice(1).join(",").trim().replace(/^"|"$/g, "");
        if (q && a) cards.push({ question: q, answer: a });
      }
    }
    return cards;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const cards = parseCSV(e.target.result);
        if (!cards || cards.length === 0) {
          setError("Invalid CSV format or no valid cards found.");
          return;
        }

        // call backend import route
        const res = await fetch(`${API}/flashcards/import`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folderId: selectedFolder._id, cards }),
        });

        const data = await res.json();
        if (!res.ok) {
          console.error("Import failed:", data);
          setError(data.message || "Import failed on server.");
          return;
        }

        // REFRESH so new flashcards show immediately
        await refreshSelectedFolder();

        alert(data.message || `Imported ${cards.length} flashcards!`);
      } catch (err) {
        console.error("Error importing CSV:", err);
        setError("Error importing CSV.");
      } finally {
        // reset input so same file can be reselected later
        if (event.target) event.target.value = "";
      }
    };

    reader.readAsText(file);
  };


  // ---------------------------
  // CARD FLIP
  // ---------------------------
  const toggleFlip = (index) => {
    setFlippedIndex(flippedIndex === index ? null : index);
  };

  // ---------------------------
  // UI START
  // ---------------------------
  return (
      <div className={`container ${sidebarActive ? "sidebar-active" : ""}`}>
        {/* Hidden File Input */}
        <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            style={{ display: "none" }}
            onChange={handleFileUpload}
        />

        {/* ---------------- FOLDER LIST ---------------- */}
        {!selectedFolder && !showFolderForm && (
            <div className="folder-view">
              <h2 className="folder-title">📁 My Flashcard Folders</h2>

              {loading && <p>Loading...</p>}

              <div className="folder-grid">
                {folders.length === 0 && !loading && (
                    <p className="empty-msg">No folders yet.</p>
                )}

                {folders.map((folder) => (
                    <div key={folder._id} className="folder-card">
                      <h3 onClick={() => openFolder(folder._id)}>{folder.name}</h3>
                      <button
                          className="delete-folder"
                          onClick={() => handleDeleteFolder(folder._id)}
                      >
                        🗑️
                      </button>
                    </div>
                ))}
              </div>

              <button className="add-flashcard" onClick={handleCreateFolder}>
                ➕ Create Folder
              </button>
            </div>
        )}

        {/* ---------------- CREATE FOLDER FORM ---------------- */}
        {showFolderForm && (
            <div className="add-card">
              <div className="form-container">
                <h3>Create New Folder</h3>

                <input
                    type="text"
                    placeholder="Enter folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                />

                {error && <p className="error">{error}</p>}

                <div className="btns">
                  <button className="save-btn" onClick={handleSaveFolder}>
                    Save
                  </button>
                  <button
                      className="cancel-btn"
                      onClick={() => setShowFolderForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* ---------------- INSIDE FOLDER ---------------- */}
        {selectedFolder && !showForm && (
            <>
              <h2 className="folder-heading">
                📂 {selectedFolder.name}
                <button
                    className="cancel-btn back-btn"
                    onClick={() => setSelectedFolder(null)}
                >
                  ⬅ Back
                </button>
              </h2>

              <div className="action-buttons">
                <button className="import-flashcard" onClick={handleImportClick}>
                  📁 Import CSV
                </button>
                <button className="add-flashcard" onClick={handleAddClick}>
                  ➕ Add Flashcard
                </button>
              </div>

              <div className="card-list-container">
                {selectedFolder.flashcards.length === 0 && (
                    <p>No flashcards in this folder.</p>
                )}

                {selectedFolder.flashcards.map((card, index) => (
                    <div key={index} className="flashcard-item">
                      <div
                          className={`flip-card ${
                              flippedIndex === index ? "flipped" : ""
                          }`}
                          onClick={() => toggleFlip(index)}
                      >
                        <div className="flip-card-inner">
                          <div className="flip-card-front">
                            <p>{card.question}</p>
                          </div>
                          <div className="flip-card-back">
                            <p>{card.answer}</p>
                          </div>
                        </div>
                      </div>

                      <div className="buttons-con">
                        <button
                            className="edit"
                            onClick={() => handleEditFlashcard(index)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                            className="delete"
                            onClick={() => handleDeleteFlashcard(index)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                ))}
              </div>
            </>
        )}

        {/* ---------------- ADD / EDIT FLASHCARD FORM ---------------- */}
        {showForm && (
            <div className="add-card">
              <div className="form-container">
                <h3>{editIndex !== null ? "Edit Flashcard" : "Add Flashcard"}</h3>

                <textarea
                    placeholder="Enter question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows="4"
                />

                <textarea
                    placeholder="Enter answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows="4"
                />

                {error && <p className="error">{error}</p>}

                <div className="btns">
                  <button className="save-btn" onClick={handleSaveFlashcard}>
                    Save
                  </button>
                  <button className="cancel-btn" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

export default MyFlashcards;
