import { useState, useEffect, useRef } from "react";

function TypewriterText({ text, speed = 50 }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!text) return;

    let cancelled = false;
    setDisplayed("");
    indexRef.current = 0;

    const typeChar = () => {
      if (cancelled) return;
      setDisplayed((prev) => prev + text.charAt(indexRef.current));
      indexRef.current += 1;

      if (indexRef.current < text.length) {
        timeoutRef.current = setTimeout(typeChar, speed);
      }
    };

    // Start typing
    timeoutRef.current = setTimeout(typeChar, speed);

    return () => {
      cancelled = true;
      clearTimeout(timeoutRef.current);
    };
  }, [text, speed]);

  return <span>{displayed}</span>;
}

export default TypewriterText;
