import React, { useState } from "react";
import "../css/settings.css";

function Settings() {
    // --- STATES ---
    const [emailData, setEmailData] = useState({
        newEmail: "",
        confirmEmail: "",
        currentPassword: "",
    });

    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: "",
        currentPassword: "",
    });

    const [message, setMessage] = useState("");

    // --- INPUT HANDLERS ---
    const handleEmailChange = (e) => {
        const { name, value } = e.target;
        setEmailData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    // --- FRONTEND VALIDATION ---
    const handleEmailSubmit = (e) => {
        e.preventDefault();
        const { newEmail, confirmEmail, currentPassword } = emailData;

        if (!newEmail || !confirmEmail || !currentPassword)
            return setMessage("⚠️ Please fill all fields.");
        if (newEmail !== confirmEmail)
            return setMessage("⚠️ New emails do not match.");

        // Simulate success
        setMessage("✅ Email updated successfully (simulation).");
        setEmailData({ newEmail: "", confirmEmail: "", currentPassword: "" });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        const { newPassword, confirmPassword, currentPassword } = passwordData;

        if (!newPassword || !confirmPassword || !currentPassword)
            return setMessage("⚠️ Please fill all fields.");
        if (newPassword !== confirmPassword)
            return setMessage("⚠️ Passwords do not match.");
        if (newPassword.length < 6)
            return setMessage("⚠️ Password should be at least 6 characters.");

        // Simulate success
        setMessage("✅ Password changed successfully (simulation).");
        setPasswordData({ newPassword: "", confirmPassword: "", currentPassword: "" });
    };

    return (
        <div className="settings-container">
            <h2 className="settings-title">SETTINGS</h2>

            <div className="settings-wrapper">
                {/* --- CHANGE EMAIL --- */}
                <div className="settings-card">
                    <h3>Change Email</h3>
                    <form onSubmit={handleEmailSubmit}>
                        <label>New Email</label>
                        <input
                            type="email"
                            name="newEmail"
                            value={emailData.newEmail}
                            onChange={handleEmailChange}
                            placeholder="Enter new email"
                        />

                        <label>Confirm New Email</label>
                        <input
                            type="email"
                            name="confirmEmail"
                            value={emailData.confirmEmail}
                            onChange={handleEmailChange}
                            placeholder="Re-enter new email"
                        />

                        <label>Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={emailData.currentPassword}
                            onChange={handleEmailChange}
                            placeholder="Enter your password"
                        />

                        <button type="submit" className="settings-btn">
                            Change Email
                        </button>
                    </form>
                </div>

                {/* --- CHANGE PASSWORD --- */}
                <div className="settings-card">
                    <h3>Change Password</h3>
                    <form onSubmit={handlePasswordSubmit}>
                        <label>New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter new password"
                        />

                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Re-enter new password"
                        />

                        <label>Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter your current password"
                        />

                        <button type="submit" className="settings-btn">
                            Change Password
                        </button>
                    </form>
                </div>
            </div>

            {message && <p className="settings-message">{message}</p>}
        </div>
    );
}

export default Settings;
