import { StarIcon } from "@heroicons/react/24/solid";

export function Stars({ score }: { score?: string }) {
  return (
    <span className="stars" aria-label={score ? `评分 ${score}` : "评分"}>
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon key={index} className="svg-icon icon-15" />
      ))}
    </span>
  );
}
