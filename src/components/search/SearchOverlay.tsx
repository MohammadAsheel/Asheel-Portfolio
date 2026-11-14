import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Fuse, { type FuseResult, type RangeTuple } from 'fuse.js';
import Icon from '@/components/common/Icon';
import { getIcon } from '@/lib/icons';
import { withBase, withoutBase } from '@/lib/paths';
import type { SearchEntry } from '@/lib/search';

const EXCERPT_RADIUS = 60;
const HISTORY_KEY = 'site-search-history';

let cachedFuse: Fuse<SearchEntry> | null = null;
let fuseFailed = false;

async function loadFuse(): Promise<Fuse<SearchEntry> | null> {
  if (cachedFuse || fuseFailed) return cachedFuse;
  try {
    const response = await fetch(withBase('/search.json'));
    const entries: SearchEntry[] = await response.json();
    cachedFuse = new Fuse(entries, {
      keys: [
        { name: 'title', weight: 3 },
        { name: 'tags', weight: 2 },
        { name: 'description', weight: 2 },
        { name: 'body', weight: 1 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 2,
      includeMatches: true,
    });
  } catch {
    fuseFailed = true;
  }
  return cachedFuse;
}

function getMatchIndices(result: FuseResult<SearchEntry>, key: string): readonly RangeTuple[] {
  const match = result.matches?.find((candidate) => candidate.key === key);
  return match?.indices ?? [];
}

function renderHighlighted(text: string, indices: readonly RangeTuple[]): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursorIndex = 0;

  indices.forEach(([startIndex, endIndex], idx) => {
    if (startIndex < cursorIndex) return;
    if (startIndex > cursorIndex) {
      nodes.push(text.slice(cursorIndex, startIndex));
    }
    nodes.push(<mark key={`${startIndex}-${endIndex}-${idx}`}>{text.slice(startIndex, endIndex + 1)}</mark>);
    cursorIndex = endIndex + 1;
  });

  if (cursorIndex < text.length) {
    nodes.push(text.slice(cursorIndex));
  }

  return nodes;
}

function renderExcerpt(result: FuseResult<SearchEntry>): ReactNode[] {
  const descriptionIndices = getMatchIndices(result, 'description');
  const bodyIndices = getMatchIndices(result, 'body');
  const { description, body } = result.item;

  if (descriptionIndices.length > 0 || bodyIndices.length === 0) {
    return renderHighlighted(description, descriptionIndices);
  }

  const [longestMatchStartIndex] = bodyIndices.reduce((longest, range) =>
    range[1] - range[0] > longest[1] - longest[0] ? range : longest,
  );
  const snippetStart = Math.max(0, longestMatchStartIndex - EXCERPT_RADIUS);
  const snippetEnd = Math.min(body.length, longestMatchStartIndex + EXCERPT_RADIUS);
  const snippet = body.slice(snippetStart, snippetEnd).replace(/\s+/g, ' ');
  const shiftedIndices: RangeTuple[] = bodyIndices
    .filter(([startIndex, endIndex]) => startIndex >= snippetStart && endIndex < snippetEnd)
    .map(([startIndex, endIndex]) => [startIndex - snippetStart, endIndex - snippetStart]);

  return renderHighlighted(snippet, shiftedIndices);
}

function loadHistory(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
    return Array.isArray(raw) ? raw.filter((q): q is string => typeof q === 'string') : [];
  } catch {
    return [];
  }
}

function saveHistory(query: string): void {
  const trimmed = query.trim();
  if (!trimmed) return;
  const history = [trimmed, ...loadHistory().filter((item) => item !== trimmed)].slice(0, 20);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

interface SearchPanelProps {
  onClose: () => void;
}

function SearchPanel({ onClose }: SearchPanelProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const queryIdRef = useRef(0);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FuseResult<SearchEntry>[]>([]);
  const [emptyMessage, setEmptyMessage] = useState('Type to search');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const runSearch = useCallback(async (searchQuery: string): Promise<void> => {
    const id = ++queryIdRef.current;
    if (!searchQuery.trim()) {
      setResults([]);
      setEmptyMessage('Type to search');
      setActiveIndex(-1);
      return;
    }

    const searchIndex = await loadFuse();
    if (id !== queryIdRef.current) return;

    if (!searchIndex) {
      setResults([]);
      setEmptyMessage('Search index could not be loaded.');
      setActiveIndex(-1);
      return;
    }

    const top = searchIndex.search(searchQuery, { limit: 8 });
    if (top.length === 0) {
      setResults([]);
      setEmptyMessage(`No matches for "${searchQuery}"`);
      setActiveIndex(-1);
      return;
    }

    setResults(top);
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    void loadFuse();
    inputRef.current?.focus();

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void runSearch(query);
    }, 150);
    return () => clearTimeout(timer);
  }, [query, runSearch]);

  useEffect(() => {
    if (activeIndex >= 0) {
      itemRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const recallHistory = (nextIndex: number): void => {
    const history = loadHistory();
    if (nextIndex < 0) {
      setHistoryIndex(-1);
      setQuery('');
      return;
    }
    if (nextIndex >= history.length) return;
    setHistoryIndex(nextIndex);
    setQuery(history[nextIndex] ?? '');
  };

  const handlePanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex >= 0) {
        recallHistory(historyIndex - 1);
      } else if (results.length > 0) {
        setActiveIndex((prev) => Math.min(results.length - 1, prev + 1));
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (historyIndex >= 0 || query.trim() === '') {
        recallHistory(historyIndex + 1);
      } else if (results.length > 0) {
        setActiveIndex((prev) => Math.max(0, prev - 1));
      }
    } else if (event.key === 'Enter') {
      const activeResult = results[activeIndex];
      if (activeResult) {
        event.preventDefault();
        saveHistory(query);
        onClose();
        navigate(withoutBase(activeResult.item.url));
      }
    } else if (event.key === 'Tab') {
      const focusables = [inputRef.current, ...itemRefs.current.slice(0, results.length), closeBtnRef.current].filter(
        Boolean,
      ) as HTMLElement[];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div
      className="theme-overlay-panel"
      role="dialog"
      aria-label="Search"
      aria-modal="true"
      onKeyDown={handlePanelKeyDown}
    >
      <div className="search-input-row">
        <span className="search-icon" aria-hidden="true">
          <Icon icon={getIcon('search')} />
        </span>
        <input
          ref={inputRef}
          id="search-input"
          type="search"
          autoComplete="off"
          spellCheck={false}
          placeholder="Search projects, experience, and skills"
          aria-label="Search query"
          value={query}
          onChange={(event) => {
            setHistoryIndex(-1);
            setQuery(event.target.value);
          }}
        />
      </div>
      <div className="search-results" id="search-results" role="listbox" aria-label="Search results">
        {results.length === 0 ? (
          <p className="search-empty">{emptyMessage}</p>
        ) : (
          results.map((result, index) => (
            <Link
              key={`${result.item.url}-${result.item.title}`}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="search-result"
              to={withoutBase(result.item.url)}
              role="option"
              aria-selected={index === activeIndex}
              onClick={() => {
                saveHistory(query);
                onClose();
              }}
            >
              <span className="search-result-title">
                {renderHighlighted(result.item.title, getMatchIndices(result, 'title'))}
              </span>
              <span className="search-result-excerpt">{renderExcerpt(result)}</span>
            </Link>
          ))
        )}
      </div>
      <div className="theme-overlay-footer">
        <span className="theme-overlay-hints" aria-hidden="true">
          <kbd>↑</kbd>
          <kbd>↓</kbd> navigate <kbd>↵</kbd> open
        </span>
        <span className="theme-overlay-actions">
          <button ref={closeBtnRef} className="theme-close-btn" type="button" id="search-close-btn" onClick={onClose}>
            esc
          </button>
        </span>
      </div>
    </div>
  );
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  return (
    <div
      className="theme-overlay"
      id="search-overlay"
      hidden={!isOpen}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {isOpen && <SearchPanel onClose={onClose} />}
    </div>
  );
}
