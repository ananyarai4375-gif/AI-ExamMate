import { LoaderCircle } from "lucide-react";

function Loading({ text = "AI is analyzing..." }) {
  return (
    <div className="loading-box">
      <LoaderCircle className="spin" size={28} />
      <span>{text}</span>
    </div>
  );
}

export default Loading;