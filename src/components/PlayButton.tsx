import { PlayIcon } from "@heroicons/react/24/solid";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type PlayButtonProps = {
  children?: ReactNode;
  className?: string;
  to?: string;
};

export function PlayButton({ children = "立即播放", className = "", to }: PlayButtonProps) {
  const content = (
    <>
      <PlayIcon className="svg-icon icon-18" />
      {children}
    </>
  );

  if (to) {
    return <Link className={`play-button button primary${className ? ` ${className}` : ""}`} to={to}>{content}</Link>;
  }

  return (
    <button className={`play-button button primary${className ? ` ${className}` : ""}`} type="button">
      {content}
    </button>
  );
}
