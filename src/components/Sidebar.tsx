import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

interface NavItem {
  icon: string;
  label: string;
  children?: { label: string }[];
}

const menu: NavItem[] = [
  { icon: "Home", label: "Главная" },
  { icon: "Search", label: "Поиск" },
  {
    icon: "MessageSquare",
    label: "Отзывы",
    children: [
      { label: "Свежие отзывы" },
      { label: "Топ за месяц" },
      { label: "Мои отзывы" },
    ],
  },
  {
    icon: "Bookmark",
    label: "Новости",
    children: [
      { label: "Главное" },
      { label: "Анонсы" },
      { label: "Обновления" },
    ],
  },
  { icon: "Compass", label: "Гайды" },
  { icon: "Map", label: "Интерактивные карты" },
  { icon: "ListMusic", label: "Плейлист" },
  {
    icon: "Monitor",
    label: "Обзор",
    children: [
      { label: "Тренды" },
      { label: "Подборки" },
      { label: "Рекомендации" },
    ],
  },
  { icon: "ShoppingBag", label: "Магазин" },
  { icon: "Sparkles", label: "Награды" },
  {
    icon: "PlayCircle",
    label: "Видео",
    children: [
      { label: "Прохождения" },
      { label: "Трейлеры" },
      { label: "Стримы" },
    ],
  },
  { icon: "Shield", label: "Политика конфиденциальности" },
  { icon: "Scale", label: "Условия использования" },
  {
    icon: "MoreHorizontal",
    label: "Ещё",
    children: [
      { label: "О проекте" },
      { label: "Связаться с нами" },
      { label: "Поддержка" },
    ],
  },
];

type Theme = "light" | "dark" | "system";

const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) ?? "system";
  });
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const root = document.documentElement;
    const apply = (t: Theme) => {
      if (t === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setSystemIsDark(prefersDark);
        root.classList.toggle("dark", prefersDark);
      } else {
        root.classList.toggle("dark", t === "dark");
      }
    };
    apply(theme);
    localStorage.setItem("theme", theme);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      setSystemIsDark(mq.matches);
      if (theme === "system") apply("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return { theme, setTheme, systemIsDark };
};

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (label: string) => void;
}

const Sidebar = ({ activeItem = "Главная", onItemClick }: SidebarProps) => {
  const [expanded, setExpanded] = useState(true);
  const [active, setActive] = useState(activeItem);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme, systemIsDark } = useTheme();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeMenuOpen(false);
      }
    };
    if (themeMenuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [themeMenuOpen]);

  const handleClick = (label: string) => {
    setActive(label);
    onItemClick?.(label);
  };

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const themes: { value: Theme; icon: string; label: string }[] = [
    { value: "light", icon: "Sun", label: "Светлая тема" },
    { value: "dark", icon: "Moon", label: "Тёмная тема" },
    { value: "system", icon: "Monitor", label: "Системная" },
  ];

  const currentTheme = themes.find((t) => t.value === theme)!;

  return (
    <aside
      className={`
        relative flex flex-col h-screen border-r border-border bg-card
        transition-all duration-300 ease-in-out shrink-0
        ${expanded ? "w-64" : "w-[60px]"}
      `}
    >
      {/* HEADER */}
      <div className={`flex items-center h-16 border-b border-border px-3 gap-3 ${!expanded && "justify-center"}`}>
        {expanded && (
          <span className="font-syne font-extrabold text-base tracking-tight flex-1 truncate">
            play<span className="text-primary">tester</span>
          </span>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
          title={expanded ? "Свернуть панель" : "Развернуть панель"}
        >
          <Icon name={expanded ? "PanelLeftClose" : "PanelLeftOpen"} size={16} />
        </button>
      </div>

      {/* NAV */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2 flex flex-col gap-0.5"
      >
        {menu.map((item) => {
          const isActive = active === item.label;
          const hasChildren = !!item.children?.length;
          const isOpen = openGroups[item.label];

          return (
            <div key={item.label}>
              <button
                onClick={() => {
                  if (hasChildren && expanded) {
                    toggleGroup(item.label);
                  } else {
                    handleClick(item.label);
                  }
                }}
                title={!expanded ? item.label : undefined}
                className={`
                  w-full flex items-center gap-3 rounded-lg transition-all duration-150
                  ${expanded ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"}
                  ${isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }
                `}
              >
                <Icon name={item.icon as "Home"} size={18} className="shrink-0" />
                {expanded && (
                  <>
                    <span className="font-inter text-sm font-medium truncate flex-1 text-left">
                      {item.label}
                    </span>
                    {hasChildren && (
                      <Icon
                        name="ChevronRight"
                        size={15}
                        className={`shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`}
                      />
                    )}
                  </>
                )}
              </button>

              {/* SUBMENU */}
              {expanded && hasChildren && isOpen && (
                <div className="ml-5 mt-0.5 mb-1 pl-3 border-l border-border flex flex-col gap-0.5">
                  {item.children!.map((sub) => (
                    <button
                      key={sub.label}
                      onClick={() => handleClick(sub.label)}
                      className={`
                        w-full text-left px-3 py-2 rounded-md font-inter text-sm transition-colors
                        ${active === sub.label
                          ? "bg-secondary/70 text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                        }
                      `}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* BACK TO TOP */}
        <div className="mt-3 pt-3 border-t border-border">
          <button
            onClick={scrollToTop}
            title="Наверх"
            className={`
              w-full flex items-center justify-center gap-2 rounded-lg
              border border-border bg-secondary/40 hover:bg-secondary
              transition-colors
              ${expanded ? "py-2.5 px-3" : "py-2.5"}
            `}
          >
            <Icon name="ArrowUp" size={15} className="shrink-0" />
            {expanded && (
              <span className="font-inter text-sm font-semibold">Наверх</span>
            )}
          </button>
        </div>
      </div>

      {/* THEME SWITCHER */}
      <div className="border-t border-border px-2 py-2 relative" ref={themeRef}>
        <button
          onClick={() => setThemeMenuOpen((v) => !v)}
          title={currentTheme.label}
          className={`
            w-full flex items-center gap-3 rounded-lg transition-all duration-150
            ${expanded ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"}
            ${themeMenuOpen
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }
          `}
        >
          <Icon name={currentTheme.icon as "Sun"} size={18} className="shrink-0" />
          {expanded && (
            <span className="font-inter text-sm font-medium truncate flex-1 text-left">
              {currentTheme.label}
            </span>
          )}
        </button>

        {themeMenuOpen && (
          <div className="absolute bottom-2 left-[calc(100%+8px)] z-50 min-w-[220px] py-1.5 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg">
            {themes.map(({ value, icon, label }) => {
              const isActive = theme === value;
              const showSystemHint = value === "system";
              return (
                <button
                  key={value}
                  onClick={() => {
                    setTheme(value);
                    setThemeMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary/70 transition-colors text-left"
                >
                  <Icon name={icon as "Sun"} size={16} className="shrink-0 text-muted-foreground" />
                  <span className="font-inter text-sm font-medium flex-1">
                    {label}
                    {showSystemHint && (
                      <span className="text-muted-foreground font-normal ml-1.5">
                        ({systemIsDark ? "тёмная" : "светлая"})
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <Icon name="Check" size={15} className="text-primary shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* USER */}
      <div className={`border-t border-border p-3 flex items-center gap-3 ${!expanded && "justify-center"}`}>
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Icon name="User" size={14} className="text-primary" />
        </div>
        {expanded && (
          <>
            <div className="flex-1 min-w-0">
              <p className="font-inter text-sm font-medium truncate">Мой аккаунт</p>
              <p className="font-inter text-xs text-muted-foreground truncate">Бесплатный план</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <Icon name="MoreHorizontal" size={16} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
