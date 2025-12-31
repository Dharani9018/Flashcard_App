import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { IoMdAddCircleOutline } from "react-icons/io";
import "../css/myFlashcards.css";
import { MdSelectAll, MdDeselect, MdDelete } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";

import FolderItem from "../components/FolderItem.jsx";
import FlashcardItem from "../components/FlashcardItem.jsx";
import FlashcardForm from "../components/FlashcardForm.jsx";
import FolderForm from "../components/FolderForm.jsx";
import FAB from "../components/FAB.jsx";

const API = "http://localhost:5000/api";

function MyFlashcards() {
  const user = JSON.parse(localStorage.getItem("user"));
  
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedFolderIndex, setSelectedFolderIndex] = useState(null);
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [flippedIndex, setFlippedIndex] = useState(null);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState(new Set());
  const [allSelected, setAllSelected] = useState(false);

  const fileInputRef = useRef(null);
  const outletContext = useOutletContext();
  const setPageTitle = outletContext?.setPageTitle || (() => {});

  useEffect(() => {
    if (user?._id) loadFolders();
    setPageTitle("My Flashcards");
  }, [user?._id]);

  // Load folders
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

  const openFolder = (index) => { 
    const folder = folders[index];
    setSelectedFolder(folder);
    setSelectedFolderIndex(index); 
    setShowForm(false);
    setError("");
    if (folder) setPageTitle(`My Flashcards / ${folder.name}`);
  };

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

  const handleDeleteFolder = async (index) => {
    if (!window.confirm("Delete this folder and all its flashcards?")) return;

    try {
      await fetch(`${API}/folders/${user._id}/${index}`, { 
        method: "DELETE",
      });
      await loadFolders();
      setSelectedFolder(null);
      setSelectedFolderIndex(null);
      setPageTitle("My Flashcards");
    } catch {
      setError("Error deleting folder");
    }
  };

  const handleAddClick = () => {
    setQuestion("");
    setAnswer("");
    setEditIndex(null);
    setShowForm(true);
  };

  const handleBackClick = () => {
    setSelectedFolder(null);
    setSelectedFolderIndex(null);
    setPageTitle("My Flashcards");
  };

  const handleSaveFlashcard = async () => {
    if (!question.trim() || !answer.trim()) {
      setError("Please fill out both fields!");
      return;
    }

    try {
      if (editIndex !== null) {
        await fetch(`${API}/flashcards/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id,          
            folderIndex: selectedFolderIndex,
            cardIndex: editIndex,     
            question,
            answer,
          }),
        });
      } else {
        await fetch(`${API}/flashcards/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            userId: user._id,          
            folderIndex: selectedFolderIndex,
            question, 
            answer 
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

  const handleEditFlashcard = (index) => {
    const card = selectedFolder.flashcards[index];
    setQuestion(card.question);
    setAnswer(card.answer);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDeleteFlashcard = async (index) => {
    try {
      await fetch(`${API}/flashcards/delete`, {
        method: "DELETE", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: user._id,           
          folderIndex: selectedFolderIndex, 
          cardIndex: index
        }),
      });
      await refreshSelectedFolder();
    } catch (err) {
      console.error(err);
      setError("Error deleting flashcard");
    }
  };

  const refreshSelectedFolder = async () => {
    const res = await fetch(`${API}/folders/${user._id}`);
    const updated = await res.json();
    setFolders(updated);
    
    if (selectedFolderIndex !== null && updated[selectedFolderIndex]) {
      const newSelectedFolder = updated[selectedFolderIndex];
      setSelectedFolder(newSelectedFolder);
      setSelectedCards(new Set());
      setAllSelected(false);
    }
  };

  const handleImportClick = () => {
    if (!selectedFolder) return alert("Open a folder first.");
    fileInputRef.current?.click();
  };

  const parseCSV = (content) => {
    const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return [];

    const firstLower = lines[0].toLowerCase();
    if (firstLower.includes("question") && firstLower.includes("answer")) {
      lines.shift();
    }

    const cards = [];
    const parseRow = (row) => {
      const result = [];
      let cur = "";
      let inQuotes = false;
      for (let i = 0; i < row.length; i++) {
        const ch = row[i];
        if (ch === '"') {
          if (inQuotes && row[i + 1] === '"') {
            cur += '"';
            i++;
          } else inQuotes = !inQuotes;
        } else if (ch === "," && !inQuotes) {
          result.push(cur);
          cur = "";
        } else cur += ch;
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const cards = parseCSV(e.target.result);
        if (!cards.length) {
          setError("Invalid CSV format or no valid cards found.");
          return;
        }

        const res = await fetch(`${API}/flashcards/import`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            userId: user._id,          
            folderIndex: selectedFolderIndex, 
            cards 
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Import failed on server.");
          return;
        }

        await refreshSelectedFolder();
        alert(data.message || `Imported ${cards.length} flashcards!`);
      } catch {
        setError("Error importing CSV.");
      } finally {
        event.target.value = "";
      }
    };

    reader.readAsText(file);
  };

  const toggleFlip = (index) => {
    setFlippedIndex(flippedIndex === index ? null : index);
  };

  const toggleSelectAll = () => {
    if (!selectedFolder) return;
    
    if (allSelected || selectedCards.size === selectedFolder.flashcards.length) {
      // If all are selected, deselect all
      setSelectedCards(new Set());
      setAllSelected(false);
    } else {
      // Select all
      const allIndices = new Set(selectedFolder.flashcards.map((_, index) => index));
      setSelectedCards(allIndices);
      setAllSelected(true);
    }
  };

  const handleSelectCard = (index) => {
    const newSelected = new Set(selectedCards);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedCards(newSelected);
    
    // Update allSelected state
    if (newSelected.size === selectedFolder?.flashcards.length) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedCards.size === 0) {
      alert("No cards selected!");
      return;
    }

    if (!window.confirm(`Delete ${selectedCards.size} selected flashcard(s)?`)) return;

    try {
      const sortedIndices = Array.from(selectedCards).sort((a, b) => b - a);
      
      for (const cardIndex of sortedIndices) {
        await fetch(`${API}/flashcards/delete`, {
          method: "DELETE", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            userId: user._id,           
            folderIndex: selectedFolderIndex, 
            cardIndex: cardIndex
          }),
        });
      }

      await refreshSelectedFolder();
      setSelectedCards(new Set());
      setAllSelected(false);
      setSelectionMode(false);
    } catch (err) {
      console.error(err);
      setError("Error deleting flashcards");
    }
  };

  // Add this useEffect to sync allSelected state
  useEffect(() => {
    if (selectedFolder && selectedCards.size === selectedFolder.flashcards.length) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  }, [selectedCards, selectedFolder]);

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (!selectionMode) {
      setSelectedCards(new Set());
      setAllSelected(false);
    }
  };

  const toggleFab = () => setFabOpen(!fabOpen);

  return (
    <div className="container">
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />

      {!selectedFolder && !showFolderForm && (
        <div className="folder-view" style={{ padding: "2rem 1rem" }}>
          {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

          <div className="folder-grid">
            {folders.length === 0 && !loading && (
              <p className="empty-msg">No folders yet.</p>
            )}

            {folders.map((folder, index) => (
              <FolderItem
                key={index}
                folder={folder}
                index={index}
                onOpen={openFolder}
                onDelete={handleDeleteFolder}
              />
            ))}
          </div>

          <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 50 }}>
            <div
              className="fab-main"
              onClick={handleCreateFolder}
              title="Create folder"
            >
              <IoMdAddCircleOutline size={28} color="white" />
            </div>
          </div>
        </div>
      )}

      {showFolderForm && (
        <FolderForm
          newFolderName={newFolderName}
          setNewFolderName={setNewFolderName}
          error={error}
          onSave={handleSaveFolder}
          onCancel={() => setShowFolderForm(false)}
        />
      )}

      {selectedFolder && !showForm && (
        <>
          <FAB
            fabOpen={fabOpen}
            onToggleFab={toggleFab}
            onImportClick={handleImportClick}
            onAddClick={handleAddClick}
            onBackClick={handleBackClick}
            onSelectClick={toggleSelectionMode} 
          />

          {/* Selection Mode Controls */}
          {selectionMode && (
            <div className="selection-controls">
              <div className="selection-actions">
                <button 
                  className="selection-btn"
                  onClick={toggleSelectAll}
                  title={allSelected ? "Deselect all" : "Select all"}
                >
                  {allSelected ? <MdDeselect size={20} /> : <MdSelectAll size={20} />}
                </button>
                
                <button 
                  className="selection-btn delete-btn"
                  onClick={handleDeleteSelected}
                  title="Delete selected"
                  disabled={selectedCards.size === 0}
                >
                  <MdDelete size={20} />  ({selectedCards.size})
                </button>
                
                <button 
                  className="selection-btn cancel-btn"
                  onClick={toggleSelectionMode}
                  title="Cancel selection"
                >
                  <RxCrossCircled size={20}/>
                </button>
              </div>
            </div>
          )}

          <div className="card-list-container">
            {selectedFolder.flashcards.length === 0 && (
              <p>No flashcards in this folder.</p>
            )}

            {selectedFolder.flashcards.map((card, index) => (
              <FlashcardItem
                key={index}
                card={card}
                index={index}
                isFlipped={flippedIndex === index}
                onFlip={toggleFlip}
                onEdit={handleEditFlashcard}
                onSelect={handleSelectCard}
                isSelected={selectedCards.has(index)}
                selectionMode={selectionMode}
              />
            ))}
          </div>
        </>
      )}

      {showForm && (
        <FlashcardForm
          question={question}
          setQuestion={setQuestion}
          answer={answer}
          setAnswer={setAnswer}
          editIndex={editIndex}
          error={error}
          onSave={handleSaveFlashcard}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default MyFlashcards;