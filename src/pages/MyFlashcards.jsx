import React, { useState, useEffect, useRef } from "react";
import "../css/myFlashcards.css";
import "../css/nav.css";
import { IoIosAdd } from "react-icons/io";
import { TbFileImport } from "react-icons/tb";

function MyFlashcards() {
  const [folders, setFolders] = useState({});
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
  const fileInputRef = useRef(null);

  useEffect(() => {
    const checkSidebar = () => {
      const sidebar = document.querySelector(".nav-menu");
      const isActive = sidebar && sidebar.classList.contains("active");
      setSidebarActive(isActive);
    };

    checkSidebar();
    const interval = setInterval(checkSidebar, 100);
    const menuBars = document.querySelector(".menu-bars");
    if (menuBars) menuBars.addEventListener("click", checkSidebar);

    return () => {
      clearInterval(interval);
      if (menuBars) menuBars.removeEventListener("click", checkSidebar);
    };
  }, []);

  // Load folders
  useEffect(() => {
    const savedFolders = localStorage.getItem("flashcardFolders");
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }
  }, []);

  // Save folders
  useEffect(() => {
    localStorage.setItem("flashcardFolders", JSON.stringify(folders));
  }, [folders]);

  const handleCreateFolder = () => {
    setShowFolderForm(true);
    setNewFolderName("");
    setError("");
  };

  const handleSaveFolder = () => {
    const name = newFolderName.trim();
    if (!name) {
      setError("Folder name cannot be empty!");
      return;
    }
    if (folders[name]) {
      setError("A folder with this name already exists!");
      return;
    }
    setFolders({ ...folders, [name]: [] });
    setShowFolderForm(false);
    setError("");
  };

  const handleDeleteFolder = (folderName) => {
    if (window.confirm(`Delete folder "${folderName}" and all its flashcards?`)) {
      const updated = { ...folders };
      delete updated[folderName];
      setFolders(updated);
      if (selectedFolder === folderName) setSelectedFolder(null);
    }
  };

  const handleAddClick = () => {
    setShowForm(true);
    setQuestion("");
    setAnswer("");
    setEditIndex(null);
    setError("");
  };

  const handleSaveFlashcard = () => {
    if (!question.trim() || !answer.trim()) {
      setError("Please fill out both fields!");
      return;
    }
    const newCard = { question, answer };
    const updated = { ...folders };

    if (editIndex !== null) {
      updated[selectedFolder][editIndex] = newCard;
    } else {
      updated[selectedFolder].push(newCard);
    }
    setFolders(updated);
    setShowForm(false);
    setError("");
  };

  const handleDeleteFlashcard = (index) => {
    const updated = { ...folders };
    updated[selectedFolder] = updated[selectedFolder].filter((_, i) => i !== index);
    setFolders(updated);
  };

  const handleEditFlashcard = (index) => {
    const card = folders[selectedFolder][index];
    setQuestion(card.question);
    setAnswer(card.answer);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsedCards = parseCSV(e.target.result);
        if (parsedCards.length > 0) {
          const updated = { ...folders };
          updated[selectedFolder] = [...updated[selectedFolder], ...parsedCards];
          setFolders(updated);
          alert(`Imported ${parsedCards.length} flashcards!`);
        } else {
          setError("No valid flashcards found in file.");
        }
      } catch {
        setError("Error parsing CSV file.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const parseCSV = (content) => {
    const lines = content.split("\n").filter((l) => l.trim());
    const cards = [];
    for (let line of lines) {
      let q = "",
          a = "";
      if (line.includes('","')) {
        const match = line.match(/^"([^"]*)","([^"]*)"$/);
        if (match) {
          q = match[1];
          a = match[2];
        }
      } else {
        const parts = line.split(",");
        if (parts.length >= 2) {
          q = parts[0];
          a = parts.slice(1).join(",");
        }
      }
      if (q && a) cards.push({ question: q, answer: a });
    }
    return cards;
  };

  const toggleFlip = (index) => {
    setFlippedIndex(flippedIndex === index ? null : index);
  };

  return (
      <div className={`container ${sidebarActive ? "sidebar-active" : ""}`}>
        <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            style={{ display: "none" }}
            onChange={handleFileUpload}
        />

        {/* Folder View */}
        {!selectedFolder && !showFolderForm && (
            <div className="folder-view">
              <h2 className="folder-title">📁 My Flashcard Folders</h2>
              <div className="folder-grid">
                {Object.keys(folders).length === 0 && (
                    <p className="empty-msg">No folders yet.</p>
                )}
                {Object.keys(folders).map((folderName) => (
                    <div key={folderName} className="folder-card">
                      <h3 onClick={() => setSelectedFolder(folderName)}>
                        {folderName}
                      </h3>
                      <button
                          className="delete-folder"
                          onClick={() => handleDeleteFolder(folderName)}
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

        {/* Folder Creation Form */}
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

        {/* Inside Folder */}
        {selectedFolder && !showForm && (
            <>
              <h2 className="folder-heading">
                📂 {selectedFolder}
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
                {folders[selectedFolder].length === 0 && (
                    <p>No flashcards in this folder.</p>
                )}

                {folders[selectedFolder].map((card, index) => (
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

        {/* Add/Edit Flashcard */}
        {showForm && (
            <div className="add-card">
              <div className="form-container">
                <h3>{editIndex !== null ? "Edit Flashcard" : "Add Flashcard"}</h3>
                <textarea
                    placeholder="Enter question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows="4"
                ></textarea>
                <textarea
                    placeholder="Enter answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows="4"
                ></textarea>
                {error && <p className="error">{error}</p>}
                <div className="btns">
                  <button className="save-btn" onClick={handleSaveFlashcard}>
                    Save
                  </button>
                  <button
                      className="cancel-btn"
                      onClick={() => setShowForm(false)}
                  >
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
