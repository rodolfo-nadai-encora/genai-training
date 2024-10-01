import React, { useState, useEffect } from "react";

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    // Load notification preference from sessionStorage on component mount
    const storedPreference = sessionStorage.getItem("notificationsEnabled");
    if (storedPreference !== null) {
      setNotificationsEnabled(JSON.parse(storedPreference));
    }
  }, []);

  const handleNotificationToggle = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    sessionStorage.setItem("notificationsEnabled", newValue);
  };

  return (
    <div className="container mx-auto">
      <div className="bg-white rounded-md shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <hr />
        <div className="flex mt-4">
          <label
            htmlFor="notifications"
            className="block text-gray-700 font-bold mb-2"
          >
            Enable Notifications
          </label>
          <input
            type="checkbox"
            id="notifications"
            checked={notificationsEnabled}
            onChange={handleNotificationToggle}
            className="mx-4"
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
