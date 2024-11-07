// ShareActivity.jsx
import React from "react";

const ShareActivity = ({ activity }) => {
  const handleShareLink = () => {
    const shareLink = `https://yourwebsite.com/activity/${activity.id}`; // Construct your link here
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch(err => {
        console.error("Could not copy link: ", err);
      });
  };

  const handleShareEmail = () => {
    const subject = `Check out this activity: ${activity.name}`;
    const body = `I thought you might be interested in this activity: ${activity.description}\n\nLink: https://yourwebsite.com/activity/${activity.id}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div>
      <h1>{activity.name}</h1>
      <p>{activity.description}</p>
      <button onClick={handleShareLink}>Share Link</button>
      <button onClick={handleShareEmail}>Share via Email</button>
    </div>
  );
};

export default ShareActivity;
