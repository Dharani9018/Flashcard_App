import React, { useState, useEffect, useRef } from "react";
import "../css/myFlashcards.css";
import "../css/nav.css";

function MyFlashcards() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [flippedIndex, setFlippedIndex] = useState(null);
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

  useEffect(() => {
    const savedFlashcards = localStorage.getItem("flashcards");
    if (savedFlashcards) {
      setFlashcards(JSON.parse(savedFlashcards));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }, [flashcards]);

  const handleAddClick = () => {
    setShowForm(true);
    setQuestion("");
    setAnswer("");
    setEditIndex(null);
    setError("");
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
        const csvContent = e.target.result;
        const parsedCards = parseCSV(csvContent);
        
        if (parsedCards.length > 0) {
          setFlashcards([...flashcards, ...parsedCards]);
          setError("");
          alert(`Successfully imported ${parsedCards.length} flashcards!`);
        } else {
          setError("No valid flashcards found in the CSV file.");
        }
      } catch (error) {
        setError("Error parsing CSV file. Please check the format.");
        console.error("CSV parsing error:", error);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  const parseCSV = (csvContent) => {
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    const flashcards = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;

      // Handle both comma-separated and quoted values
      let question = '';
      let answer = '';
      
      if (line.includes('","')) {
        // Handle quoted CSV format
        const match = line.match(/^"([^"]*)","([^"]*)"$/);
        if (match) {
          question = match[1].trim();
          answer = match[2].trim();
        }
      } else {
        // Handle simple comma-separated format
        const parts = line.split(',').map(part => part.trim());
        if (parts.length >= 2) {
          question = parts[0];
          answer = parts.slice(1).join(','); // In case answer contains commas
        }
      }

      // Only add if both fields have content
      if (question && answer) {
        flashcards.push({ question, answer });
      }
    }

    return flashcards;
  };

  const handleClose = () => {
    setShowForm(false);
    setError("");
  };

  const handleSave = () => {
    if (!question.trim() || !answer.trim()) {
      setError("Please fill out both fields!");
      return;
    }

    const newCard = { question, answer };

    if (editIndex !== null) {
      const updatedCards = [...flashcards];
      updatedCards[editIndex] = newCard;
      setFlashcards(updatedCards);
    } else {
      setFlashcards([...flashcards, newCard]);
    }

    setShowForm(false);
    setQuestion("");
    setAnswer("");
    setError("");
  };

  const handleEdit = (index) => {
    const card = flashcards[index];
    setQuestion(card.question);
    setAnswer(card.answer);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updatedCards = flashcards.filter((_, i) => i !== index);
    setFlashcards(updatedCards);
  };

  const toggleFlip = (index) => {
    if (flippedIndex === index) {
      setFlippedIndex(null);
    } else {
      // Smooth transition: wait a moment before flipping the next
      setFlippedIndex(null);
      setTimeout(() => setFlippedIndex(index), 150);
    }
  };

  return (
    <div className={`container ${sidebarActive ? "sidebar-active" : ""}`}>
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      
      {!showForm ? (
        <>
          <div className="action-buttons">
            <button className="import-flashcard" onClick={handleImportClick}>
              📁 Import CSV
            </button>
            <button className="add-flashcard" onClick={handleAddClick}>
              ➕ Add Flashcard
            </button>
          </div>

          <div className="card-list-container">
            {flashcards.length === 0 && <p>No flashcards yet.</p>}

            {flashcards.map((card, index) => (
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
                  <button className="edit" onClick={() => handleEdit(index)}>
                    ✏️ Edit
                  </button>
                  <button className="delete" onClick={() => handleDelete(index)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="add-card">
          <div className="form-container">
            <h3>{editIndex !== null ? "Edit Flashcard" : "Add Flashcard"}</h3>
            <textarea
              placeholder="Enter question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows="4"
              cols="40"
            ></textarea>

            <textarea
              placeholder="Enter answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows="4"
              cols="40"
            ></textarea>

            {error && <p className="error">{error}</p>}
            <div className="btns">
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
              <button className="cancel-btn" onClick={handleClose}>
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