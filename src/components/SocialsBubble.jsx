import { useState } from "react";
import "./SocialsBubble.css";

const darkenColor = (hex, percent) => {
  let color = hex.startsWith("#") ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
};

const SocialsBubble = ({
  color = "#5227FF",
  rotate = 0,
  decayX = 0,
  decayY = 0,
  scale = 1,
  className = "",
  href = "#",
  targetBlank = true,
  children
}) => {


  return (
    <a
      href={href}
      target={targetBlank ? "_blank" : undefined}
      rel={targetBlank ? "noopener noreferrer" : undefined}
      className={`social-bubble ${className}`}
      style={{ color, transform: `translate(${decayX}px, ${decayY}px) scale(${scale}) rotate(${rotate}deg)` }}
    >
      {children}
    </a>
  );
};

export default SocialsBubble;