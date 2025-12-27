import { useState, useEffect } from "react";
import "../css/reviewMode.css";
import { useOutletContext, useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

function ReviewMode() {
	const [user, setUser] = useState(null);
	const [folders, setFolders] = useState([]);
	const [selectedFolderIndices, setSelectedFolderIndices] = useState([]); // CHANGED
	const [step, setStep] = useState(0);
	const [loading, setLoading] = useState(true);

	const outletContext = useOutletContext();
	const setPageTitle = outletContext?.setPageTitle || (() => {});
	const navigate = useNavigate();

	useEffect(() => {
		setPageTitle("Review Mode");
		try {
			const userData = localStorage.getItem("user");
			if (userData) setUser(JSON.parse(userData));
		} catch (error) {
			console.error("Error loading user:", error);
		}
	}, []);

	useEffect(() => {
		if (!user) return;

		async function loadFolders() {
			try {
				setLoading(true);
				const res = await fetch(`${API}/folders/${user._id}`);
				if (!res.ok) throw new Error("Failed to fetch folders");
				const data = await res.json();
				console.log("Loaded folders:", data);
				setFolders(data || []);
			} catch (err) {
				console.error("Error loading folders:", err);
				setFolders([]);
			} finally {
				setLoading(false);
			}
		}

		loadFolders();
	}, [user]);

	const toggleFolder = (index) => { 
		setSelectedFolderIndices((prev) =>
			prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
		);
	};

	const proceedToMode = () => {
		if (selectedFolderIndices.length === 0) return;
		setStep(1);
	};

	const handleModeSelect = (mode) => {

		sessionStorage.setItem("reviewFolderIndices", JSON.stringify(selectedFolderIndices));
		if (mode === "swipe") navigate("/login/home/review/swipe");
		else if (mode === "typing") navigate("/login/home/review/typing");
	};

	if (step === 0) {
		return (
			<div className="review-container">
				<div className="review-content">
					<h2 className="review-title">Select Folders to Review</h2>

					{loading ? (
						<p>Loading folders...</p>
					) : folders.length === 0 ? (
						<div>
							<p>No folders found.</p>
							<p className="hint">Create folders in "My Flashcards" first!</p>
						</div>
					) : (
						<>
							<div className="folder-select-list">
								{folders.map((folder, index) => ( 
									<label
										key={index}
										className={`folder-select-item${
											selectedFolderIndices.includes(index) ? " selected" : ""
										}`}
									>
										<input
											type="checkbox"
											checked={selectedFolderIndices.includes(index)}
											onChange={() => toggleFolder(index)}
										/>
										<span>
											{folder.name} ({folder.flashcards?.length || 0} cards)
										</span>
									</label>
								))}
							</div>

							<div className="button-container">
								<button
									className="proceed-btn"
									disabled={selectedFolderIndices.length === 0}
									onClick={proceedToMode}
								>
									Next ({selectedFolderIndices.length} folder
									{selectedFolderIndices.length !== 1 ? "s" : ""} selected)
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		);
	}
	
	if (step === 1) {
		const totalCards = folders
			.filter((folder, index) => selectedFolderIndices.includes(index))
			.reduce((sum, folder) => sum + (folder.flashcards?.length || 0), 0);

		return (
			<div className="review-container">
				<h2 className="review-title">Choose Review Mode</h2>

				<p className="selection-info">
					Selected {selectedFolderIndices.length} folder
					{selectedFolderIndices.length !== 1 ? "s" : ""} • {totalCards} cards total
				</p>

				<div className="mode-select-list">
					<button className="mode-btn swipe-mode" onClick={() => handleModeSelect("swipe")}>
						<div className="mode-title">Swipe Mode</div>
						<div className="mode-desc">Flip cards and swipe to answer</div>
					</button>

					<button className="mode-btn typing-mode" onClick={() => handleModeSelect("typing")}>
						<div className="mode-title">Typing Mode</div>
						<div className="mode-desc">Type answers to test recall</div>
					</button>
				</div>

				<button className="back-btn" onClick={() => setStep(0)}>
					⬅ Back to Folder Selection
				</button>
			</div>
		);
	}

	return null;
}

export default ReviewMode;