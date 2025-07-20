
import React, { useState, useEffect } from "react";
import { Stage, Layer, Rect, Text } from "react-konva";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://ulaxmqgdwrtsbxdjimwa.supabase.co", "YOUR_SUPABASE_ANON_KEY");

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    async function loadContent() {
      const { data } = await supabase.from("content").select("*");
      const items = data.map((item, i) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        x: (i % 5) * 220,
        y: Math.floor(i / 5) * 180,
      }));
      setNodes(items);
    }
    loadContent();
  }, []);

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const newScale = e.evt.deltaY > 0 ? scale / scaleBy : scale * scaleBy;
    setScale(newScale);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <h1 className="text-center text-2xl font-bold p-4">To Put Into Practice – Visual Canvas</h1>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 100}
        draggable
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        onWheel={handleWheel}
        onDragEnd={(e) => setPosition({ x: e.target.x(), y: e.target.y() })}
      >
        <Layer>
          {nodes.map((node) => (
            <React.Fragment key={node.id}>
              <Rect x={node.x} y={node.y} width={200} height={120} fill="#1f2937" shadowBlur={10} cornerRadius={8} />
              <Text x={node.x + 10} y={node.y + 10} text={node.title} fontSize={16} fill="#fff" />
              <Text x={node.x + 10} y={node.y + 40} width={180} text={node.description} fontSize={12} fill="#aaa" />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
