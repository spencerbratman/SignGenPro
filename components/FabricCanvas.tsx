import React, { useEffect, useRef, useState, useCallback } from "react";
import { useFabric } from "../hooks/useFabric";
import ColorPicker from "./ColorPicker";

interface FabricCanvasProps {
  color: string;
  setColor: (color: string) => void;
  isMobile: boolean;
}

const FabricCanvas: React.FC<FabricCanvasProps> = ({
  color,
  setColor,
  isMobile,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [brushWidth, setBrushWidth] = useState(2);
  const [cleanupEnabled, setCleanupEnabled] = useState(false);
  const [cleanupIntensity, setCleanupIntensity] = useState(5); // Scale from 0 to 10
  const [originalPaths, setOriginalPaths] = useState<fabric.Path[]>([]);
  const fabric = useFabric();
  const brushPreviewRef = useRef<HTMLCanvasElement>(null);

  const updateBrushPreview = useCallback(() => {
    if (brushPreviewRef.current) {
      const ctx = brushPreviewRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 50, 50);
        ctx.beginPath();
        ctx.arc(25, 25, brushWidth / 2, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }
  }, [brushWidth, color]);

  useEffect(() => {
    if (canvasRef.current && fabric && !canvas) {
      const newCanvas = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        width: canvasRef.current.offsetWidth,
        height: 200,
        backgroundColor: "transparent",
      });

      newCanvas.freeDrawingBrush = new fabric.PencilBrush(newCanvas);
      newCanvas.freeDrawingBrush.color = color;
      newCanvas.freeDrawingBrush.width = brushWidth;

      newCanvas.on("path:created", updateBrushPreview);

      setCanvas(newCanvas);
    }

    return () => {
      if (canvas) {
        canvas.off("path:created", updateBrushPreview);
      }
    };
  }, [fabric, canvas, color, brushWidth, updateBrushPreview]);

  useEffect(() => {
    if (canvas && fabric) {
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = brushWidth;
      updatePathProperties(canvas, { stroke: color, strokeWidth: brushWidth });
      canvas.renderAll();
      updateBrushPreview();
    }
  }, [canvas, color, brushWidth, fabric, updateBrushPreview]);

  const updatePathProperties = (
    canvas: fabric.Canvas,
    properties: Partial<fabric.IObjectOptions>,
  ) => {
    canvas.getObjects("path").forEach((path) => {
      path.set(properties);
    });
  };

  const handleBrushWidthChange = (newWidth: number) => {
    setBrushWidth(newWidth);
    if (canvas) {
      canvas.freeDrawingBrush.width = newWidth;
      updatePathProperties(canvas, { strokeWidth: newWidth });
      canvas.renderAll();
    }
    updateBrushPreview();
  };

  const handleClear = () => {
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = "transparent";
      canvas.renderAll();
      setOriginalPaths([]);
    }
  };

  const handleUndo = () => {
    if (canvas) {
      const objects = canvas.getObjects();
      if (objects.length > 0) {
        canvas.remove(objects[objects.length - 1]);
        canvas.renderAll();
        setOriginalPaths((prevPaths) => prevPaths.slice(0, -1));
      }
    }
  };

  const handleDownload = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 2,
      });
      const link = document.createElement("a");
      link.download = "signature.png";
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const toggleCleanup = () => {
    if (!cleanupEnabled) {
      // Store original paths when enabling cleanup
      setOriginalPaths(
        canvas
          ?.getObjects()
          .filter((obj) => obj instanceof fabric.Path) as fabric.Path[],
      );
    } else {
      // Restore original paths when disabling cleanup
      if (canvas) {
        canvas.clear();
        originalPaths.forEach((path) => canvas.add(path));
        canvas.renderAll();
      }
      setCleanupIntensity(5);
    }
    setCleanupEnabled(!cleanupEnabled);
  };

  const handleCleanupIntensityChange = (change: number) => {
    const newIntensity = Math.max(0, Math.min(10, cleanupIntensity + change));
    setCleanupIntensity(newIntensity);
    applyCleanup(newIntensity);
  };

  const applyCleanup = (intensity: number) => {
    if (canvas && fabric && originalPaths.length > 0) {
      const enhancedPaths = originalPaths.map((path) =>
        enhancePath(path, intensity),
      );
      canvas.clear();
      enhancedPaths.forEach((path) => canvas.add(path));
      canvas.renderAll();
    }
  };

  const enhancePath = (path: fabric.Path, intensity: number): fabric.Path => {
    if (!fabric) return path;

    let points: { x: number; y: number }[] = [];

    path.path.forEach((cmd) => {
      switch (cmd[0]) {
        case "M":
        case "L":
          points.push({ x: cmd[1] as number, y: cmd[2] as number });
          break;
        case "Q":
          points.push({ x: cmd[3] as number, y: cmd[4] as number });
          break;
        case "C":
          points.push({ x: cmd[5] as number, y: cmd[6] as number });
          break;
      }
    });

    if (points.length < 3) {
      return path;
    }

    // Apply smoothing multiple times based on cleanup intensity
    for (let i = 0; i < intensity; i++) {
      points = smoothPath(points);
    }

    // Simplify path more aggressively
    points = simplifyPath(points, 0.5 + intensity * 0.5);

    const newPath = new fabric.Path(pointsToSVGPath(points), {
      stroke: path.stroke,
      strokeWidth: path.strokeWidth,
      fill: "transparent",
    });

    return newPath;
  };

  const smoothPath = (
    points: { x: number; y: number }[],
  ): { x: number; y: number }[] => {
    const smoothed: { x: number; y: number }[] = [];
    for (let i = 0; i < points.length; i++) {
      const prev2 = points[i - 2] || points[i];
      const prev1 = points[i - 1] || points[i];
      const curr = points[i];
      const next1 = points[i + 1] || points[i];
      const next2 = points[i + 2] || points[i];
      smoothed.push({
        x: (prev2.x + prev1.x + curr.x * 3 + next1.x + next2.x) / 7,
        y: (prev2.y + prev1.y + curr.y * 3 + next1.y + next2.y) / 7,
      });
    }
    return smoothed;
  };

  const simplifyPath = (
    points: { x: number; y: number }[],
    tolerance: number,
  ): { x: number; y: number }[] => {
    if (points.length <= 2) return points;

    const squaredTolerance = tolerance * tolerance;
    let newPoints = [points[0]];

    for (let i = 1; i < points.length - 1; i++) {
      const prev = newPoints[newPoints.length - 1];
      const curr = points[i];
      const next = points[i + 1];

      if (
        Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2) >
          squaredTolerance ||
        Math.pow(next.x - curr.x, 2) + Math.pow(next.y - curr.y, 2) >
          squaredTolerance
      ) {
        newPoints.push(curr);
      }
    }

    newPoints.push(points[points.length - 1]);
    return newPoints;
  };

  const pointsToSVGPath = (points: { x: number; y: number }[]): string => {
    let svgPath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      svgPath += ` L ${points[i].x} ${points[i].y}`;
    }
    return svgPath;
  };

  const getColorName = (hex: string) => {
    const colorNames: { [key: string]: string } = {
      "#000000": "Black",
      "#FFFFFF": "White",
      "#FF0000": "Red",
      "#00FF00": "Lime",
      "#0000FF": "Blue",
      "#FFFF00": "Yellow",
      "#00FFFF": "Cyan",
      "#FF00FF": "Magenta",
      "#808080": "Gray",
      "#800000": "Maroon",
      "#808000": "Olive",
      "#008000": "Green",
      "#800080": "Purple",
      "#008080": "Teal",
      "#000080": "Navy",
    };
    return colorNames[hex.toUpperCase()] || hex;
  };

  if (!fabric) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded w-full"
      />
      <div
        className={`mt-4 ${isMobile ? "flex flex-col space-y-2" : "flex items-center space-x-4"}`}
      >
        <div
          className={`${isMobile ? "w-full" : "w-1/2"} flex items-center space-x-2`}
        >
          <label className="block text-sm font-medium text-gray-700">
            Brush Width
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushWidth}
            onChange={(e) => handleBrushWidthChange(Number(e.target.value))}
            className="w-full"
          />
          <canvas
            ref={brushPreviewRef}
            width="50"
            height="50"
            className="border border-gray-300"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <ColorPicker color={color} onChange={setColor} />
          <span className="text-sm text-gray-600">{getColorName(color)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={cleanupEnabled}
              onChange={toggleCleanup}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Enable Cleanup</span>
          </label>
          {cleanupEnabled && (
            <>
              <button
                onClick={() => handleCleanupIntensityChange(-1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span>{cleanupIntensity}</span>
              <button
                onClick={() => handleCleanupIntensityChange(1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </>
          )}
        </div>
      </div>
      <div
        className={`mt-4 ${isMobile ? "flex flex-col space-y-2" : "flex justify-between space-x-4"}`}
      >
        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Download
        </button>
        <button
          onClick={handleUndo}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded w-full"
        >
          Undo Last Stroke
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded w-full"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default FabricCanvas;
