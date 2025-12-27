import "../css/FolderForm.css";

function FolderForm({ 
  newFolderName, 
  setNewFolderName, 
  error, 
  onSave, 
  onCancel 
}) {
  return (
    <div className="add-card">
      <div className="form-container">
        <h3>Create New Folder</h3>
        <input 
          className="input-area"
          type="text"
          placeholder="Enter folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <div className="btns">
          <button className="save-btn" onClick={onSave}>
            Save
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default FolderForm;