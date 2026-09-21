import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeTerminal, addToHistory, clearHistory } from '@/store/terminalSlice';
import { toggleTheme } from '@/store/themeSlice';

const COMMANDS = {
  help: () => `Available commands:
  help        - Show this help message
  about       - Learn about Nitin
  skills      - View technical skills
  projects    - See featured projects
  resume      - Download resume
  contact     - Get contact information
  github      - Open GitHub profile
  linkedin    - Open LinkedIn profile
  whoami      - Who is this developer?
  clear       - Clear terminal
  theme       - Toggle dark/light mode`,

  about: () => `
╭─────────────────────────────────────╮
│  Nitin Tuvar                        │
│  Full Stack MERN Developer          │
╰─────────────────────────────────────╯

Passionate about building scalable web applications
with the MERN stack. Specializing in React, Node.js,
Express, and MongoDB.

Currently exploring microservices architecture,
real-time apps with Socket.io, and advanced React
patterns.

Type 'skills' to see my tech stack.`,

  skills: () => `
─── Frontend ──────────────
  HTML5 • CSS3 • JavaScript
  React • Redux Toolkit
  Tailwind CSS • Bootstrap

─── Backend ───────────────
  Node.js • Express.js
  REST APIs • Socket.io
  Passport.js

─── Database ──────────────
  MongoDB

─── Tools ─────────────────
  Git • GitHub • Cloudinary
  Postman • Vercel`,

  projects: () => `
┌─ Featured Projects ─────────────────┐
│                                     │
│  1. MoveEZ                          │
│     Vehicle delivery platform       │
│     → moveezzz.vercel.app           │
│                                     │
│  2. urliFy                          │
│     URL shortener + analytics       │
│     → url-ify.vercel.app            │
│                                     │
│  3. Spicey                          │
│     Food delivery application       │
│     → spicey.vercel.app             │
│                                     │
│  4. Bank Backend                    │
│     Banking API system              │
│                                     │
└─────────────────────────────────────┘`,

  contact: () => `
  ✉  nitintuvar2003@gmail.com
  🔗 github.com/tuvarnitin
  💼 linkedin.com/in/tuvar-nitin
  📱 +91 8053445590

  Say hello! I'd love to connect.`,

  github: () => {
    window.open('https://github.com/tuvarnitin', '_blank');
    return 'Opening GitHub profile...';
  },

  linkedin: () => {
    window.open('https://linkedin.com/in/tuvar-nitin', '_blank');
    return 'Opening LinkedIn profile...';
  },

  resume: () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Nitin_Tuvar_Resume.pdf';
    link.target = '_blank';
    link.click();
    return 'Downloading resume...';
  },

  whoami: () => `
  ┌──────────────────────────────────┐
  │  Name:  Nitin Tuvar              │
  │  Role:  Full Stack Developer     │
  │  Stack: MERN                     │
  │  Focus: Scalable Web Apps        │
  │  Goal:  Build amazing products   │
  └──────────────────────────────────┘`,
};

export default function Terminal() {
  const isOpen = useSelector((state) => state.terminal.isOpen);
  const dispatch = useDispatch();
  const [lines, setLines] = useState([
    { type: 'output', text: 'Welcome to Nitin\'s Terminal v1.0.0' },
    { type: 'output', text: 'Type "help" for available commands.\n' },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const overlayRef = useRef(null);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCommand = useCallback((cmd) => {
    const trimmed = cmd.trim().toLowerCase();

    // Add command to display
    setLines((prev) => [...prev, { type: 'command', text: cmd }]);

    if (trimmed === 'clear') {
      setLines([]);
      return;
    }

    if (trimmed === '') return;

    if (trimmed === 'theme') {
      dispatch(toggleTheme());
      setLines((prev) => [...prev, { type: 'output', text: 'Theme toggled successfully.' }]);
      return;
    }

    const handler = COMMANDS[trimmed];
    if (handler) {
      const result = handler();
      setLines((prev) => [...prev, { type: 'output', text: result }]);
    } else {
      setLines((prev) => [
        ...prev,
        { type: 'output', text: `Command not found: ${trimmed}\nType "help" for available commands.` },
      ]);
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setCommandHistory((prev) => [input, ...prev]);
      setHistoryIndex(-1);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      dispatch(closeTerminal());
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`terminal-overlay ${isOpen ? 'active' : ''}`}
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Interactive terminal"
    >
      <div className="terminal-window">
        <div className="terminal-titlebar">
          <div
            className="terminal-dot close"
            onClick={() => dispatch(closeTerminal())}
            role="button"
            aria-label="Close terminal"
            tabIndex={0}
          />
          <div className="terminal-dot minimize" />
          <div className="terminal-dot maximize" />
          <span className="terminal-title">nitin@portfolio ~ %</span>
        </div>

        <div className="terminal-body" ref={bodyRef} onClick={() => inputRef.current?.focus()}>
          {lines.map((line, i) => (
            <div className="terminal-line" key={i}>
              {line.type === 'command' ? (
                <>
                  <span className="terminal-prompt">→ </span>
                  <span>{line.text}</span>
                </>
              ) : (
                <span className="terminal-output">{line.text}</span>
              )}
            </div>
          ))}

          <div className="terminal-input-line">
            <span className="terminal-prompt">→ </span>
            <input
              ref={inputRef}
              className="terminal-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              aria-label="Terminal command input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
