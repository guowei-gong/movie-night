export function Stars({ score }: { score?: string }) {
  const value = Number(score ?? 5);

  return (
    <span className="stars" aria-label={score ? `评分 ${score}` : "评分"}>
      {Array.from({ length: 5 }, (_, index) => {
        const fill = value - index;
        const className = fill >= 1 ? "star full" : fill > 0 ? "star half" : "star empty";

        return (
          <span className={className} key={index}>
            ★
          </span>
        );
      })}
    </span>
  );
}
