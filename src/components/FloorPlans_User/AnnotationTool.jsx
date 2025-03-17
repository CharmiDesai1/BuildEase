import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "./AnnotationTool.module.css";

export const AnnotationTool = ({ imageUrl, propertyId }) => {
  const [userId, setUserId] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [annotations, setAnnotations] = useState([]);
  const [tool, setTool] = useState("freehand");
  const [penColor, setPenColor] = useState("#ff0000");
  const [drawing, setDrawing] = useState(false);
  const [freehandPath, setFreehandPath] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    let storedUserId = localStorage.getItem("userId");
    const urlParams = new URLSearchParams(window.location.search);
    const googleUserId = urlParams.get("userId");

    if (googleUserId) {
      localStorage.setItem("userId", googleUserId);
      storedUserId = googleUserId;
      window.history.replaceState(null, "", "/floor-plans");
    }

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("User ID not found.");
    }
  }, []);

  useEffect(() => {
    if (!userId || !propertyId) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const image = imageRef.current;
    if (image.complete) {
      initializeCanvas();
    } else {
      image.onload = initializeCanvas;
    }

    function initializeCanvas() {
      canvas.width = image.width;
      canvas.height = image.height;
      redrawCanvas();
    }
  }, [imageUrl, annotations]);

  const redrawCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(imageRef.current, 0, 0);

    annotations.forEach((annotation) => {
      ctx.strokeStyle = annotation.color || "#ff0000";
      ctx.fillStyle = annotation.color || "#ff0000";
      ctx.lineWidth = 2;

      if (annotation.type === "text") {
        ctx.font = "16px Arial";
        ctx.fillText(annotation.text, annotation.x, annotation.y);
      } else if (annotation.type === "circle") {
        ctx.beginPath();
        ctx.arc(annotation.x, annotation.y, annotation.radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (annotation.type === "square") {
        ctx.strokeRect(annotation.x, annotation.y, annotation.width, annotation.height);
      } else if (annotation.type === "freehand") {
        ctx.beginPath();
        ctx.moveTo(annotation.path[0].x, annotation.path[0].y);
        annotation.path.forEach((point) => ctx.lineTo(point.x, point.y));
        ctx.stroke();
      }
    });
  };

  const handleMouseDown = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (tool === "text") {
        setAnnotations([...annotations, { type: "text", text, x, y, color: penColor  }]);
        setText("");
    } else if (tool === "move") {
      const foundAnnotation = findAnnotationAt(x, y);
      if (foundAnnotation) setSelectedAnnotation(foundAnnotation);
    } else if (tool === "freehand") {
      setDrawing(true);
      setFreehandPath([{ x, y }]);
    } else if (tool === "circle" || tool === "square") {
      setStartPoint({ x, y });
    } else if (tool === "eraser") {
      eraseAnnotation(x, y);
    }
  };

  const handleMouseMove = (event) => {
    if (!drawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (tool === "freehand") {
      setFreehandPath([...freehandPath, { x, y }]);
    }
  };

  const handleMouseUp = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (drawing && tool === "freehand") {
      setAnnotations([...annotations, { type: "freehand", path: freehandPath, color: penColor  }]);
      setFreehandPath([]);
    } else if (tool === "circle" && startPoint) {
      const radius = Math.sqrt((x - startPoint.x) ** 2 + (y - startPoint.y) ** 2);
      setAnnotations([...annotations, { type: "circle", x: startPoint.x, y: startPoint.y, radius, color: penColor  }]);
    } else if (tool === "square" && startPoint) {
      const width = x - startPoint.x;
      const height = y - startPoint.y;
      setAnnotations([...annotations, { type: "square", x: startPoint.x, y: startPoint.y, width, height, color: penColor  }]);
    } else if (selectedAnnotation && tool === "move") {
      moveAnnotation(selectedAnnotation, x, y);
      setSelectedAnnotation(null);
    }

    setDrawing(false);
    setStartPoint(null);
  };

  const findAnnotationAt = (x, y) => {
    const ctx = canvasRef.current.getContext("2d");

    return annotations.find((annotation) => {
      if (annotation.type === "text") {
        const textWidth = ctx.measureText(annotation.text).width;
        return x >= annotation.x && x <= annotation.x + textWidth && Math.abs(annotation.y - y) < 10;
      } else if (annotation.type === "circle") {
        return Math.sqrt((annotation.x - x) ** 2 + (annotation.y - y) ** 2) < annotation.radius;
      } else if (annotation.type === "square") {
        return x >= annotation.x && x <= annotation.x + annotation.width && y >= annotation.y && y <= annotation.y + annotation.height;
      } else if (annotation.type === "freehand") {
        return annotation.path.some((point) => Math.abs(point.x - x) < 5 && Math.abs(point.y - y) < 5);
      }
      return false;
    });
  };

  const eraseAnnotation = (x, y) => {
    setAnnotations((prevAnnotations) =>
      prevAnnotations.filter((annotation) => findAnnotationAt(x, y) !== annotation)
    );
  };

  const moveAnnotation = (annotation, newX, newY) => {
    setAnnotations((prevAnnotations) =>
      prevAnnotations.map((a) =>
        a === annotation ? { ...a, x: newX, y: newY } : a
      )
    );
  };

  const saveAnnotations = async () => {
    const canvas = canvasRef.current;
    console.log("User ID before sending request:", userId);
  
    if (!userId || isNaN(userId)) {
      alert("Invalid userId: " + userId);
      return;
    }
  
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob, "annotated-floorplan.png");
      formData.append("propertyId", propertyId);
      formData.append("userId", userId);
  
      try {
        const response = await axios.post("http://localhost:5000/save-annotation", formData);
        alert(response.data.message);
        window.location.reload();
      } catch (error) {
        console.error("Error saving annotation:", error);
        alert("Failed to save annotation.");
      }
    });
  };

  return (
    <div className={styles.annotationContainer}>
      <h2>Annotating Floor Plan</h2>
      <div className={styles.toolbar}>
        <button onClick={() => setTool("freehand")}>🖍 Freehand</button>
        <button onClick={() => setTool("text")}>🔤 Text</button>
        <button onClick={() => setTool("circle")}>⚪ Circle</button>
        <button onClick={() => setTool("square")}>⬛ Square</button>
        <button onClick={() => setTool("eraser")}>🗑 Eraser</button>
        <button onClick={() => setTool("move")}>✋ Move</button>
        <button className={styles.colorPickerButton}>
          🎨 Color
          <input 
            type="color" 
            value={penColor} 
            onChange={(e) => setPenColor(e.target.value)} 
            className={styles.colorPicker}
          />
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {tool === "text" && (
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text"
          />
        )}
        <div className={styles.canvasWrapper} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
          <img ref={imageRef} src={imageUrl} alt="Floor Plan" className={styles.hiddenImage} />
          <canvas ref={canvasRef} className={styles.annotationCanvas} />
        </div>
      </div>

      <button onClick={saveAnnotations}>Save Annotations</button>
    </div>
  );
};
