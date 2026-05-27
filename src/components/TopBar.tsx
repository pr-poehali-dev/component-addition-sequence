import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

interface TopBarItem {
  icon: string;
  label: string;
  children?: { label: string }[];
}

const items: TopBarItem[] = [
  { icon: "Search", label: "Поиск" },
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
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    if (openMenu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openMenu]);

  const handleClick = (item: TopBarItem) => {
    if (item.children?.length) {
      setOpenMenu((prev) => (prev === item.label ? null : item.label));
    } else {
      onItemClick?.(item.label);
      setOpenMenu(null);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="fixed top-4 right-4 z-40 flex items-center gap-1 px-2 py-1.5 bg-card/95 backdrop-blur border border-border rounded-full shadow-lg"
    >
      {items.map((item) => {
        const isOpen = openMenu === item.label;
        return (
          <div key={item.label} className="relative">
            <button
              onClick={() => handleClick(item)}
              title={item.label}
              className={`
                w-9 h-9 flex items-center justify-center rounded-full transition-colors
                ${isOpen
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                }
              `}
            >
              <Icon name={item.icon as "Search"} size={17} />
            </button>

            {isOpen && item.children && (
              <div className="absolute top-[calc(100%+8px)] right-0 min-w-[240px] py-1.5 bg-popover text-popover-foreground border border-border rounded-lg shadow-xl animate-fade-in">
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
                      className="w-full text-left px-3 py-2 font-inter text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors"
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
