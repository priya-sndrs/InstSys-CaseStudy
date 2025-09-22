import { useState, useEffect, useRef } from "react";

function TypewriterText({ text = "", speed = 50 }) {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const indexRef = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!text) {
      setDisplayed("");
      setIsTyping(false);
      return;
    }

    setDisplayed("");
    setIsTyping(true);
    indexRef.current = 0;

    const fullText = text;

    const typeChar = () => {
      setDisplayed(fullText.slice(0, indexRef.current + 1));
      indexRef.current += 1;

      if (indexRef.current < fullText.length) {
        timeoutRef.current = setTimeout(typeChar, speed);
      } else {
        setIsTyping(false);
        setDisplayed(fullText); // final refresh
      }
    };

    timeoutRef.current = setTimeout(typeChar, speed);

    return () => clearTimeout(timeoutRef.current);
  }, [text, speed]);

  // 🔥 Global click listener
  useEffect(() => {
    const handleGlobalClick = () => {
      if (isTyping) {
        clearTimeout(timeoutRef.current);
        setDisplayed(text);
        setIsTyping(false);
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [isTyping, text]);

  return (
    <span
      dangerouslySetInnerHTML={{
        __html: displayed.replace(/\n/g, "<br/>"),
      }}
    />
  );
}

export default TypewriterText;
