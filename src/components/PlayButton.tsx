import { PlayIcon } from "@heroicons/react/24/solid";
import type { ReactNode } from "react";

type PlayButtonProps = {
  children?: ReactNode;
  className?: string;
};

export function PlayButton({ children = "立即播放", className = "" }: PlayButtonProps) {
  return (
    <button className={`play-button button primary${className ? ` ${className}` : ""}`} type="button">
      <PlayIcon className="svg-icon icon-18" />
      {children}
    </button>
  );
}
