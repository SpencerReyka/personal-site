'use client';

import '@xterm/xterm/css/xterm.css';
import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'claude-mobile-config';

interface Config {
  wsUrl: string;
  token: string;
}

export default function TerminalPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formInput, setFormInput] = useState({ wsUrl: '', token: '' });
  const containerRef = useRef<HTMLDivElement>(null);

  // Load saved config on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Config;
        setConfig(saved);
        setFormInput(saved);
      } else {
        setShowForm(true);
      }
    } catch {
      setShowForm(true);
    }
  }, []);

  // Initialize xterm + WebSocket once we have config and a container
  useEffect(() => {
    if (!config || !containerRef.current) return;

    let isMounted = true;
    let teardown: (() => void) | undefined;

    async function setup() {
      const { Terminal } = await import('@xterm/xterm');
      const { FitAddon } = await import('@xterm/addon-fit');
      if (!isMounted || !containerRef.current) return;

      const term = new Terminal({
        theme: {
          background: '#0f0f0f',
          foreground: '#e8e8e8',
          cursor: '#a78bfa',
          selectionBackground: '#a78bfa40',
        },
        fontFamily: '"Menlo", "Monaco", "Courier New", monospace',
        fontSize: 14,
        cursorBlink: true,
        scrollback: 5000,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(containerRef.current);
      fitAddon.fit();

      let ws: WebSocket | null = null;
      let retryTimer: ReturnType<typeof setTimeout> | null = null;
      let retryDelay = 1000;
      let shouldReconnect = true;

      const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit();
        if (ws?.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'resize', cols: term.cols, rows: term.rows }));
        }
      });
      resizeObserver.observe(containerRef.current);

      term.onData((data) => {
        if (ws?.readyState === WebSocket.OPEN) ws.send(data);
      });

      function connect() {
        if (!shouldReconnect) return;
        const url = `${config!.wsUrl.replace(/\/$/, '')}?token=${encodeURIComponent(config!.token)}`;
        ws = new WebSocket(url);

        ws.onopen = () => {
          retryDelay = 1000;
          term.write('\r\n\x1b[32m[connected]\x1b[0m\r\n');
          ws!.send(JSON.stringify({ type: 'resize', cols: term.cols, rows: term.rows }));
        };

        ws.onmessage = (e) => {
          term.write(e.data as string);
        };

        ws.onclose = (e) => {
          if (!shouldReconnect) return;
          if (e.code === 4401) {
            term.write('\r\n\x1b[31m[auth failed — check your token]\x1b[0m\r\n');
            return;
          }
          term.write(
            `\r\n\x1b[33m[disconnected — reconnecting in ${retryDelay / 1000}s…]\x1b[0m\r\n`,
          );
          retryTimer = setTimeout(() => {
            retryDelay = Math.min(retryDelay * 2, 30_000);
            connect();
          }, retryDelay);
        };
      }

      connect();

      teardown = () => {
        shouldReconnect = false;
        if (retryTimer) clearTimeout(retryTimer);
        ws?.close();
        resizeObserver.disconnect();
        term.dispose();
      };
    }

    setup();

    return () => {
      isMounted = false;
      teardown?.();
    };
  }, [config]);

  function saveAndConnect(e: React.FormEvent) {
    e.preventDefault();
    const cfg = { wsUrl: formInput.wsUrl.trim(), token: formInput.token.trim() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    setConfig(cfg);
    setShowForm(false);
  }

  if (showForm || !config) {
    return (
      <div className="flex items-center justify-center h-full">
        <form className="flex flex-col gap-3 w-80" onSubmit={saveAndConnect}>
          <h1 className="text-fg font-mono text-lg mb-2">claude-mobile</h1>
          <input
            className="bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-fg font-mono text-sm outline-none focus:border-[#a78bfa]"
            placeholder="wss://xxxx.trycloudflare.com"
            value={formInput.wsUrl}
            onChange={(e) => setFormInput((p) => ({ ...p, wsUrl: e.target.value }))}
            required
          />
          <input
            className="bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-fg font-mono text-sm outline-none focus:border-[#a78bfa]"
            placeholder="JWT token"
            type="password"
            value={formInput.token}
            onChange={(e) => setFormInput((p) => ({ ...p, token: e.target.value }))}
            required
          />
          <button
            type="submit"
            className="bg-[#a78bfa] text-[#0f0f0f] font-mono text-sm font-semibold rounded px-3 py-2 cursor-pointer hover:opacity-90"
          >
            Connect
          </button>
          {config && (
            <button
              type="button"
              className="text-[#888] font-mono text-xs hover:text-fg"
              onClick={() => setShowForm(false)}
            >
              cancel
            </button>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />
      {/* Settings button — update tunnel URL when cloudflared restarts */}
      <button
        className="absolute top-2 right-3 text-[#444] hover:text-[#888] font-mono text-xs z-10"
        onClick={() => setShowForm(true)}
        title="Update connection settings"
      >
        ⚙
      </button>
    </div>
  );
}
