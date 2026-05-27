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
    label: "Обзоры",
    children: [
      { label: "Все обзоры" },
      { label: "Выбор редакции" },
      { label: "Обзоры игр" },
      { label: "Обзоры фильмов" },
      { label: "Обзоры сериалов" },
      { label: "Обзоры техники" },
    ],
  },
  {
    icon: "Bookmark",
    label: "Новости",
    children: [
      { label: "Все новости" },
      { label: "Колонки" },
      { label: "PlayStation" },
      { label: "Xbox" },
      { label: "Nintendo" },
      { label: "PC" },
      { label: "Мобильные" },
      { label: "Фильмы" },
      { label: "Сериалы" },
      { label: "Комиксы" },
      { label: "Техника" },
    ],
  },
  { icon: "Compass", label: "Гайды" },
  { icon: "Map", label: "Интерактивные карты" },
  { icon: "ListMusic", label: "Плейлист" },
  {
    icon: "Monitor",
    label: "Открытия",
    children: [
      { label: "IGN Live Билеты" },
      { label: "METRO 2039" },
      { label: "Гайд по миру NTE" },
      { label: "World of Warcraft: Midnight Hub" },
      { label: "Planet Pokemon" },
      { label: "Гайд по миру Перси Джексона" },
      { label: "Скоро выйдут: Игры" },
      { label: "Скоро выйдут: Фильмы" },
      { label: "Скоро выйдут: Сериалы" },
      { label: "Предзаказы" },
      { label: "Kingdom Come Deliverance II" },
      { label: "Трейлеры игр" },
      { label: "Трейлеры фильмов" },
      { label: "Трейлеры сериалов" },
      { label: "Лучшая техника для гейминга" },
    ],
  },
  { icon: "ShoppingBag", label: "Магазин" },
  { icon: "Sparkles", label: "Награды" },
  {
    icon: "PlayCircle",
    label: "Видео",
    children: [
      { label: "Оригинальные шоу" },
      { label: "Популярное" },
      { label: "Трейлеры" },
      { label: "Геймплей" },
      { label: "Все видео" },
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
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [popoverTop, setPopoverTop] = useState<number>(0);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (popoverRef.current && !popoverRef.current.contains(target)) {
        const trigger = (target as HTMLElement).closest("[data-popover-trigger]");
        if (!trigger) setOpenPopover(null);
      }
    };
    if (openPopover) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openPopover]);

  useEffect(() => {
    const onScroll = () => setOpenPopover(null);
    const el = scrollRef.current;
    el?.addEventListener("scroll", onScroll);
    return () => el?.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (label: string) => {
    setActive(label);
    onItemClick?.(label);
    setOpenPopover(null);
  };

  const togglePopover = (label: string, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.closest("[data-nav-row]")?.getBoundingClientRect();
    if (rect) setPopoverTop(rect.top);
    setOpenPopover((prev) => (prev === label ? null : label));
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

          return (
            <div
              key={item.label}
              data-nav-row
              className={`
                w-full flex items-center gap-3 rounded-lg transition-all duration-150
                ${expanded ? "pr-1" : ""}
                ${isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }
              `}
            >
              <button
                onClick={() => handleClick(item.label)}
                title={!expanded ? item.label : undefined}
                className={`
                  flex items-center gap-3 flex-1 min-w-0
                  ${expanded ? "px-3 py-2.5" : "px-0 py-2.5 justify-center w-full"}
                `}
              >
                <Icon name={item.icon as "Home"} size={18} className="shrink-0" />
                {expanded && (
                  <span className="font-inter text-sm font-medium truncate text-left">
                    {item.label}
                  </span>
                )}
              </button>

              {expanded && hasChildren && (
                <button
                  data-popover-trigger
                  onClick={(e) => togglePopover(item.label, e)}
                  className={`
                    shrink-0 w-7 h-7 flex items-center justify-center rounded-md
                    transition-colors hover:bg-secondary
                    ${openPopover === item.label ? "bg-secondary text-foreground" : ""}
                  `}
                  title="Открыть подменю"
                >
                  <Icon
                    name="ChevronRight"
                    size={15}
                    className={`transition-transform ${openPopover === item.label ? "translate-x-0.5" : ""}`}
                  />
                </button>
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

      {/* POPOVER (модальное окно подменю рядом с пунктом) */}
      {openPopover && (() => {
        const item = menu.find((m) => m.label === openPopover);
        if (!item?.children) return null;
        const sidebarWidth = expanded ? 256 : 60;
        return (
          <div
            ref={popoverRef}
            style={{ top: popoverTop, left: sidebarWidth + 8, maxHeight: "80vh" }}
            className="fixed z-50 min-w-[240px] flex flex-col bg-popover text-popover-foreground border border-border rounded-lg shadow-xl animate-fade-in"
          >
            <div className="px-3 py-2 border-b border-border flex items-center gap-2 shrink-0">
              <Icon name={item.icon as "Home"} size={15} className="text-muted-foreground" />
              <span className="font-syne text-sm font-semibold">{item.label}</span>
            </div>
            <div className="py-1 overflow-y-auto">
              {item.children.map((sub) => (
                <button
                  key={sub.label}
                  onClick={() => handleClick(sub.label)}
                  className={`
                    w-full text-left px-3 py-2 font-inter text-sm transition-colors
                    ${active === sub.label
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                    }
                  `}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>
        );
      })()}
    </aside>
  );
};

export default Sidebar;