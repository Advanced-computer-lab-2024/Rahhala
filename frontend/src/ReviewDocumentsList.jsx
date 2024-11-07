// ReviewDocumentsList.jsx
import React from "react";

const ReviewDocumentsList = ({ users, onDecision }) => {
  return (
    <div>
      {users.length > 0 ? (
        users.map((user) => (
          <div key={user.id} className="user-review-card">
            <h3>{user.name} - {user.role}</h3>
            <p>Email: {user.email}</p>
            <div>
              {user.documents.map((doc, index) => (
                <a key={index} href={doc.url} target="_blank" rel="noopener noreferrer">
                  View {doc.type}
                </a>
              ))}
            </div>
            <div>
              <button onClick={() => onDecision(user.id, "accept")}>Accept</button>
              <button onClick={() => onDecision(user.id, "reject")}>Reject</button>
            </div>
          </div>
        ))
      ) : (
        <p>No pending registrations to review.</p>
      )}
    </div>
  );
};

export default ReviewDocumentsList;
