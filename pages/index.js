import { useEffect, useRef, useState } from "react";

const COMMANDS = {
  ABOUT: "about",
  AUTHOR: "author",
  CLEAR: "clear",
  HELP: "help",
  WEBSITE: "website",
};

const TYPES = {
  TEXT: "text",
  LINK: "link",
  COMMAND: "command",
};

const BOOT_LINES = ["Starting...", "Welcome!", "Type help for commands"];

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
          updated[lineIndex] = {
            type: TYPES.TEXT,
            content: currentLine,
          };
        } else {
          updated.push({
            type: TYPES.TEXT,
            content: currentLine,
          });
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
      let output = {};

      switch (cmd) {
        case COMMANDS.ABOUT:
          output = {
            type: TYPES.TEXT,
            content: "This is a terminal-style website built with Next.js!",
          };
          break;
        case COMMANDS.AUTHOR:
          output = {
            type: TYPES.LINK,
            content: "Created by @Thean Yee Sin, check out my ",

            href: "https://github.com/theanyeesin",
            linkText: "Github",
          };
          break;
        case COMMANDS.CLEAR:
          setHistory([]);
          setInput("");
          return;
        case COMMANDS.HELP:
          output = {
            type: TYPES.TEXT,
            content: `Available commands: ${Object.values(COMMANDS).join(
              ", ",
            )}`,
          };
          break;
        case COMMANDS.WEBSITE:
          output = {
            type: TYPES.LINK,
            content: "Check out my website: ",
            href: "https://theanyeesin.com",
            linkText: "theanyeesin.com",
          };
          break;
        default:
          output = { type: TYPES.TEXT, content: `Command not found: ${cmd}` };
      }

      setHistory((prev) => [
        ...prev,
        { type: TYPES.COMMAND, content: `$ ${cmd}` },
        output,
      ]);
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
        {history.map((item, i) => {
          if (item.type === TYPES.TEXT || item.type === TYPES.COMMAND) {
            return <div key={i}>{item.content}</div>;
          }
          if (item.type === TYPES.LINK) {
            return (
              <div key={i}>
                {item.content}
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-green-300"
                >
                  {item.linkText}
                </a>
              </div>
            );
          }
          return null;
        })}
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
