
import React, { useRef, useEffect, useState } from "react";

const Node = ({ x, y, content }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        background: "#fcd34d",
        padding: "12px",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        width: "180px",
        userSelect: "none"
      }}
    >
      {content}
    </div>
  );
};

export default function App() {
  const containerRef = useRef(null);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      const newScale = Math.min(Math.max(transform.scale - e.deltaY * 0.001, 0.5), 2);
      setTransform((prev) => ({ ...prev, scale: newScale }));
    };

    const container = containerRef.current;
    container.addEventListener("wheel", handleWheel);
    return () => container.removeEventListener("wheel", handleWheel);
  }, [transform.scale]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#f0f9ff",
        position: "relative",
        fontFamily: "sans-serif"
      }}
    >
      <div
        style={{
          transform: `scale(${transform.scale}) translate(${transform.x}px, ${transform.y}px)`,
          transformOrigin: "0 0",
          width: "2000px",
          height: "2000px",
          position: "absolute",
        }}
      >
        <Node x={100} y={100} content="📝 Article: Learning to Learn" />
        <Node x={400} y={200} content="🎥 Video: How memory works" />
        <Node x={700} y={400} content="🎙️ Voice Note: Mind Map summary" />
      </div>
    </div>
  );
}
