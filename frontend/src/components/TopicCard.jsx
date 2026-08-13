import { BookOpen } from "lucide-react";

function TopicCard({ topic, index }) {
  return (
    <div className="topic-card">
      <div className="topic-number">{index + 1}</div>

      <div>
        <h3>{topic}</h3>
        <p>
          Important concept identified from your uploaded material.
        </p>
      </div>

      <BookOpen size={20} />
    </div>
  );
}

export default TopicCard;