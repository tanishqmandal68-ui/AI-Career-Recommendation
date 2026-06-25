import { getScoreTier } from "~/lib/utils";

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  const { bgColor, textColor, label } = getScoreTier(score);

  return (
    <div className={`px-3 py-1 rounded-full ${bgColor} ${textColor}`}>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
};

export default ScoreBadge;
