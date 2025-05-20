import { useEffect, useRef, useState } from "react";

const Command = {
  HELP: "help",
  ABOUT: "about",
  CLEAR: "clear",
};

const BOOT_LINES = ["Starting...", "Type help for commands"];

export default function Home() {
  // States
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [booting, setBooting] = useState(true);

  // Refs
  const inputRef = useRef(null);

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let currentLine = "";

    const typeNextChar = () => {
      if (lineIndex >= BOOT_LINES.length) {
        setBooting(false);
        return;
      }

      currentLine += BOOT_LINES[lineIndex][charIndex];
      setHistory((prev) => {
        const updated = [...prev];

        // If the line is already in the history, update it, else add it
        if (lineIndex < updated.length) {
          updated[lineIndex] = currentLine;
        } else {
          updated.push(currentLine);
        }

        return updated;
      });
      charIndex++;

      if (charIndex <= BOOT_LINES[lineIndex].length) {
        setTimeout(typeNextChar, 50);
      } else {
        lineIndex++;
        charIndex = 0;
        currentLine = "";
        setTimeout(typeNextChar, 1000);
      }
    };

    typeNextChar();
  }, []);

  // Handling typing commands
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const cmd = input.trim();
      let output = "";

      switch (cmd) {
        case Command.HELP:
          output = `Available commands: ${Object.values(Command).join(", ")}`;
          break;
        case Command.ABOUT:
          output = "This is a terminal-style website built with Next.js!";
          break;
        case Command.CLEAR:
          setHistory([]);
          setInput("");
          return;
        default:
          output = `Command not found: ${cmd}`;
      }

      setHistory((prev) => [...prev, `$ ${cmd}`, output]);
      setInput("");
    } else if (e.key === "Backspace") {
      setInput((prev) => prev.slice(0, -1));
    } else if (e.key.length === 1) {
      setInput((prev) => prev + e.key);
    }
    e.preventDefault();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className=" h-screen bg-black text-green-500 font-mono"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="w-full max-w-3xl px-4">
        {history.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        {!booting && (
          <div className="flex items-start">
            <span>$&nbsp;</span>
            <div
              ref={inputRef}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              className="outline-none whitespace-pre"
            >
              {input}
              <span className="animate-pulse">█</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
