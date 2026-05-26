import { useState } from "react";
import Icon from "@/components/ui/icon";

interface NavItem {
  icon: string;
  label: string;
}

const mainNav: NavItem[] = [
  { icon: "House", label: "Dashboard" },
  { icon: "Gamepad2", label: "My Games" },
  { icon: "Zap", label: "Active Tests" },
  { icon: "Archive", label: "Builds" },
];

const libraryNav: NavItem[] = [
  { icon: "LayoutDashboard", label: "Reports" },
  { icon: "Clock", label: "History" },
  { icon: "Video", label: "Recordings" },
  { icon: "Clock3", label: "Scheduled" },
  { icon: "ThumbsUp", label: "Liked" },
];

const systemNav: NavItem[] = [
  { icon: "Settings", label: "Settings" },
  { icon: "Flag", label: "Report issue" },
  { icon: "HelpCircle", label: "Help" },
];

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (label: string) => void;
}

const Sidebar = ({ activeItem = "Dashboard", onItemClick }: SidebarProps) => {
  const [expanded, setExpanded] = useState(true);
  const [active, setActive] = useState(activeItem);

  const handleClick = (label: string) => {
    setActive(label);
    onItemClick?.(label);
  };

  const NavRow = ({ item }: { item: NavItem }) => (
    <button
      onClick={() => handleClick(item.label)}
      className={`
        w-full flex items-center gap-3 rounded-lg transition-all duration-150
        ${expanded ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"}
        ${active === item.label
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        }
      `}
      title={!expanded ? item.label : undefined}
    >
      <Icon name={item.icon as "House"} size={18} className="shrink-0" />
      {expanded && (
        <span className="font-inter text-sm font-medium truncate">{item.label}</span>
      )}
    </button>
  );

  return (
    <aside
      className={`
        relative flex flex-col h-screen border-r border-border bg-card
        transition-all duration-300 ease-in-out shrink-0
        ${expanded ? "w-56" : "w-[56px]"}
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
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <Icon name={expanded ? "PanelLeftClose" : "PanelLeftOpen"} size={16} />
        </button>
      </div>

      {/* NAV */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 flex flex-col gap-0.5">
        {mainNav.map((item) => (
          <NavRow key={item.label} item={item} />
        ))}

        <div className="my-2 border-t border-border" />

        {libraryNav.map((item) => (
          <NavRow key={item.label} item={item} />
        ))}

        <div className="my-2 border-t border-border" />

        {systemNav.map((item) => (
          <NavRow key={item.label} item={item} />
        ))}
      </div>

      {/* USER */}
      <div className={`border-t border-border p-3 flex items-center gap-3 ${!expanded && "justify-center"}`}>
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Icon name="User" size={14} className="text-primary" />
        </div>
        {expanded && (
          <>
            <div className="flex-1 min-w-0">
              <p className="font-inter text-sm font-medium truncate">My Account</p>
              <p className="font-inter text-xs text-muted-foreground truncate">Free plan</p>
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
