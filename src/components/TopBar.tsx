import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

interface TopBarItem {
  icon: string;
  label: string;
  children?: { label: string }[];
}

const items: TopBarItem[] = [
  { icon: "Sparkles", label: "Награды" },
  {
    icon: "MoreHorizontal",
    label: "Ещё",
    children: [
      { label: "О проекте" },
      { label: "Связаться с нами" },
      { label: "Поддержка" },
      { label: "Политика конфиденциальности" },
      { label: "Условия использования" },
    ],
  },
];

interface TopBarProps {
  onItemClick?: (label: string) => void;
}

const TopBar = ({ onItemClick }: TopBarProps) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        if (!searchValue) setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchValue]);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
    }
  }, [searchOpen]);

  const handleClick = (item: TopBarItem) => {
    if (item.children?.length) {
      setOpenMenu((prev) => (prev === item.label ? null : item.label));
    } else {
      onItemClick?.(item.label);
      setOpenMenu(null);
    }
  };

  const toggleSearch = () => {
    setOpenMenu(null);
    setSearchOpen((prev) => {
      if (prev) setSearchValue("");
      return !prev;
    });
  };

  return (
    <div
      ref={wrapperRef}
      className="fixed top-4 right-4 z-40 flex items-center gap-1 px-2 py-1.5 bg-card border border-border rounded-full"
    >
      <div className="flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Поиск..."
          className={`
            bg-transparent outline-none font-inter text-sm text-foreground placeholder:text-muted-foreground
            transition-[width,padding,opacity] duration-300 ease-out
            ${searchOpen ? "w-56 opacity-100 px-3" : "w-0 opacity-0 px-0"}
          `}
        />
        <button
          onClick={toggleSearch}
          title="Поиск"
          className={`
            w-9 h-9 flex items-center justify-center rounded-full shrink-0
            ${searchOpen ? "bg-secondary text-foreground" : "text-muted-foreground"}
          `}
        >
          <Icon name={searchOpen ? "X" : "Search"} size={17} />
        </button>
      </div>

      {items.map((item) => {
        const isOpen = openMenu === item.label;
        return (
          <div key={item.label} className="relative">
            <button
              onClick={() => handleClick(item)}
              title={item.label}
              className={`
                w-9 h-9 flex items-center justify-center rounded-full
                ${isOpen ? "bg-secondary text-foreground" : "text-muted-foreground"}
              `}
            >
              <Icon name={item.icon as "Search"} size={17} />
            </button>

            {isOpen && item.children && (
              <div className="absolute top-[calc(100%+8px)] right-0 min-w-[240px] py-1.5 bg-popover text-popover-foreground border border-border rounded-lg">
                <div className="px-3 py-2 border-b border-border flex items-center gap-2">
                  <Icon name={item.icon as "Search"} size={15} className="text-muted-foreground" />
                  <span className="font-syne text-sm font-semibold">{item.label}</span>
                </div>
                <div className="py-1">
                  {item.children.map((sub) => (
                    <button
                      key={sub.label}
                      onClick={() => {
                        onItemClick?.(sub.label);
                        setOpenMenu(null);
                      }}
                      className="w-full text-left px-3 py-2 font-inter text-sm text-muted-foreground"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TopBar;
