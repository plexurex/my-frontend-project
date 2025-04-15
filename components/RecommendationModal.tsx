import { useState } from 'react';
import StarRating from './StarRating';

const RecommendationModal = ({ cityName, onClose }: { cityName: string, onClose: () => void }) => {
  const [rating, setRating] = useState(3);  // Default rating is 3
  const [feedback, setFeedback] = useState('');
  const [relevance, setRelevance] = useState(3); // Rating for relevance
  const [experience, setExperience] = useState(3); // Rating for overall experience
  const [additionalFeedback, setAdditionalFeedback] = useState('');

  const handleSubmit = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/submit-recommendation-feedback/", {
      method: "POST",
      body: JSON.stringify({
        city: cityName,
        rating,
        feedback,
        relevance,
        experience,
        additional_feedback: additionalFeedback,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      alert('Thank you for your feedback!');
      onClose();  // Close the modal after submission
    } else {
      alert('Error submitting feedback');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Rate the Recommendation for {cityName}</h2>

        {/* Rating Section: User Recommendation */}
        <div>
          <p>How relevant is this recommendation?</p>
          <StarRating value={relevance} onChange={setRelevance} />
        </div>

        {/* Experience Section: Overall Experience */}
        <div>
          <p>How was your overall experience with this city recommendation?</p>
          <StarRating value={experience} onChange={setExperience} />
        </div>

        {/* Feedback Section */}
        <div>
          <label>Additional Feedback (Optional): </label>
          <textarea
            value={additionalFeedback}
            onChange={(e) => setAdditionalFeedback(e.target.value)}
            className="w-full"
          />
        </div>

        <button onClick={handleSubmit}>Submit Feedback</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default RecommendationModal;
