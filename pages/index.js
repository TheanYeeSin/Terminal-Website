import { useEffect, useRef, useState } from "react";

const Command = {
  HELP: "help",
  ABOUT: "about",
  CLEAR: "clear",
};

export default function Home() {
  const [history, setHistory] = useState([
    "Starting...",
    "Type help for commands",
  ]);
  const [input, setInput] = useState("");
  const [caretVisible, setCaretVisible] = useState(true);

  const inputRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCaretVisible((v) => !v);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const cmd = input.trim();
      let output = "";

      switch (cmd) {
        case Command.HELP:
          output = "Available commands: help, about, clear";
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
        <div className="flex items-start">
          <span>$&nbsp;</span>
          <div
            ref={inputRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="outline-none whitespace-pre"
          >
            {input}
            {caretVisible && <span className="animate-blink">█</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
