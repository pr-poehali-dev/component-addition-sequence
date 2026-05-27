import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";

type TagCategory = "genre" | "platform" | "mood" | "mode";

interface Game {
  title: string;
  year: number;
  cover: string;
  tags: { genre: string[]; platform: string[]; mood: string[]; mode: string[] };
}

const CATEGORIES: { key: TagCategory; label: string; icon: string }[] = [
  { key: "genre", label: "Жанры", icon: "Swords" },
  { key: "platform", label: "Платформы", icon: "Joystick" },
  { key: "mood", label: "Настроение", icon: "Sparkles" },
  { key: "mode", label: "Режим игры", icon: "Users" },
];

const TAGS: Record<TagCategory, string[]> = {
  genre: ["RPG", "Шутер", "Хоррор", "Стратегия", "Гонки", "Платформер", "Приключение", "Симулятор", "Файтинг", "Souls-like", "Метроидвания", "Открытый мир"],
  platform: ["PC", "PlayStation", "Xbox", "Switch", "Мобильные"],
  mood: ["Расслабляющая", "Напряжённая", "Динамичная", "Медитативная", "Атмосферная", "Весёлая"],
  mode: ["Одиночная", "Кооператив", "Мультиплеер", "Сплит-скрин"],
};

const GAMES: Game[] = [
  { title: "Baldur's Gate 3", year: 2023, cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400", tags: { genre: ["RPG", "Приключение"], platform: ["PC", "PlayStation", "Xbox"], mood: ["Атмосферная", "Напряжённая"], mode: ["Одиночная", "Кооператив", "Мультиплеер"] } },
  { title: "Elden Ring", year: 2022, cover: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400", tags: { genre: ["RPG", "Souls-like", "Открытый мир"], platform: ["PC", "PlayStation", "Xbox"], mood: ["Напряжённая", "Атмосферная"], mode: ["Одиночная", "Кооператив"] } },
  { title: "Hollow Knight", year: 2017, cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400", tags: { genre: ["Метроидвания", "Платформер"], platform: ["PC", "PlayStation", "Xbox", "Switch"], mood: ["Атмосферная", "Медитативная"], mode: ["Одиночная"] } },
  { title: "Resident Evil 4 Remake", year: 2023, cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400", tags: { genre: ["Хоррор", "Шутер"], platform: ["PC", "PlayStation", "Xbox"], mood: ["Напряжённая"], mode: ["Одиночная"] } },
  { title: "Stardew Valley", year: 2016, cover: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=400", tags: { genre: ["Симулятор"], platform: ["PC", "PlayStation", "Xbox", "Switch", "Мобильные"], mood: ["Расслабляющая", "Медитативная"], mode: ["Одиночная", "Кооператив"] } },
  { title: "Cyberpunk 2077", year: 2020, cover: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400", tags: { genre: ["RPG", "Шутер", "Открытый мир"], platform: ["PC", "PlayStation", "Xbox"], mood: ["Атмосферная", "Динамичная"], mode: ["Одиночная"] } },
  { title: "It Takes Two", year: 2021, cover: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=400", tags: { genre: ["Платформер", "Приключение"], platform: ["PC", "PlayStation", "Xbox", "Switch"], mood: ["Весёлая"], mode: ["Кооператив", "Сплит-скрин"] } },
  { title: "Doom Eternal", year: 2020, cover: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400", tags: { genre: ["Шутер"], platform: ["PC", "PlayStation", "Xbox", "Switch"], mood: ["Динамичная", "Напряжённая"], mode: ["Одиночная", "Мультиплеер"] } },
  { title: "Forza Horizon 5", year: 2021, cover: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400", tags: { genre: ["Гонки", "Открытый мир"], platform: ["PC", "Xbox"], mood: ["Расслабляющая", "Динамичная"], mode: ["Одиночная", "Мультиплеер"] } },
  { title: "Hades", year: 2020, cover: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400", tags: { genre: ["RPG", "Приключение"], platform: ["PC", "PlayStation", "Xbox", "Switch"], mood: ["Динамичная", "Атмосферная"], mode: ["Одиночная"] } },
  { title: "Civilization VI", year: 2016, cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400", tags: { genre: ["Стратегия"], platform: ["PC", "PlayStation", "Xbox", "Switch", "Мобильные"], mood: ["Медитативная"], mode: ["Одиночная", "Мультиплеер"] } },
  { title: "Tekken 8", year: 2024, cover: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400", tags: { genre: ["Файтинг"], platform: ["PC", "PlayStation", "Xbox"], mood: ["Напряжённая", "Динамичная"], mode: ["Одиночная", "Мультиплеер"] } },
  { title: "Animal Crossing: New Horizons", year: 2020, cover: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400", tags: { genre: ["Симулятор"], platform: ["Switch"], mood: ["Расслабляющая", "Весёлая"], mode: ["Одиночная", "Мультиплеер"] } },
  { title: "Alan Wake 2", year: 2023, cover: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", tags: { genre: ["Хоррор", "Приключение"], platform: ["PC", "PlayStation", "Xbox"], mood: ["Атмосферная", "Напряжённая"], mode: ["Одиночная"] } },
  { title: "Genshin Impact", year: 2020, cover: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400", tags: { genre: ["RPG", "Открытый мир"], platform: ["PC", "PlayStation", "Мобильные"], mood: ["Атмосферная", "Расслабляющая"], mode: ["Одиночная", "Кооператив"] } },
  { title: "Apex Legends", year: 2019, cover: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400", tags: { genre: ["Шутер"], platform: ["PC", "PlayStation", "Xbox", "Switch", "Мобильные"], mood: ["Динамичная", "Напряжённая"], mode: ["Мультиплеер", "Кооператив"] } },
  { title: "Hollow Wake", year: 2024, cover: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400", tags: { genre: ["Метроидвания", "Хоррор"], platform: ["PC", "Switch"], mood: ["Атмосферная"], mode: ["Одиночная"] } },
  { title: "Lethal Company", year: 2023, cover: "https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400", tags: { genre: ["Хоррор", "Приключение"], platform: ["PC"], mood: ["Напряжённая", "Весёлая"], mode: ["Кооператив", "Мультиплеер"] } },
  { title: "Persona 5 Royal", year: 2019, cover: "https://images.unsplash.com/photo-1606092677800-30c43e3d9b8d?w=400", tags: { genre: ["RPG"], platform: ["PC", "PlayStation", "Xbox", "Switch"], mood: ["Атмосферная"], mode: ["Одиночная"] } },
  { title: "Among Us", year: 2018, cover: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400", tags: { genre: ["Приключение"], platform: ["PC", "PlayStation", "Xbox", "Switch", "Мобильные"], mood: ["Весёлая"], mode: ["Мультиплеер"] } },
  { title: "Sea of Thieves", year: 2018, cover: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400", tags: { genre: ["Приключение", "Открытый мир"], platform: ["PC", "Xbox", "PlayStation"], mood: ["Весёлая", "Атмосферная"], mode: ["Кооператив", "Мультиплеер"] } },
  { title: "Mario Kart 8 Deluxe", year: 2017, cover: "https://images.unsplash.com/photo-1591105327764-4d2a4c990a09?w=400", tags: { genre: ["Гонки"], platform: ["Switch"], mood: ["Весёлая", "Динамичная"], mode: ["Одиночная", "Мультиплеер", "Сплит-скрин"] } },
  { title: "Disco Elysium", year: 2019, cover: "https://images.unsplash.com/photo-1572177812156-58036aae439c?w=400", tags: { genre: ["RPG", "Приключение"], platform: ["PC", "PlayStation", "Xbox", "Switch"], mood: ["Атмосферная", "Медитативная"], mode: ["Одиночная"] } },
  { title: "StarCraft II", year: 2010, cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&sat=-100", tags: { genre: ["Стратегия"], platform: ["PC"], mood: ["Напряжённая", "Динамичная"], mode: ["Одиночная", "Мультиплеер"] } },
  { title: "Microsoft Flight Simulator", year: 2020, cover: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400", tags: { genre: ["Симулятор"], platform: ["PC", "Xbox"], mood: ["Медитативная", "Расслабляющая"], mode: ["Одиночная", "Мультиплеер"] } },
];

const GameCompass = () => {
  const [selected, setSelected] = useState<Record<TagCategory, string[]>>({
    genre: [],
    platform: [],
    mood: [],
    mode: [],
  });

  const toggleTag = (cat: TagCategory, tag: string) => {
    setSelected((prev) => ({
      ...prev,
      [cat]: prev[cat].includes(tag) ? prev[cat].filter((t) => t !== tag) : [...prev[cat], tag],
    }));
  };

  const clearAll = () => setSelected({ genre: [], platform: [], mood: [], mode: [] });

  const allSelected = useMemo(
    () => [
      ...selected.genre,
      ...selected.platform,
      ...selected.mood,
      ...selected.mode,
    ],
    [selected]
  );

  const filtered = useMemo(() => {
    if (allSelected.length === 0) return GAMES;
    return GAMES.filter((game) => {
      const match = (cat: TagCategory) =>
        selected[cat].some((tag) => game.tags[cat].includes(tag));
      return (
        match("genre") ||
        match("platform") ||
        match("mood") ||
        match("mode")
      );
    });
  }, [allSelected, selected]);

  return (
    <div>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
          <Icon name="Compass" size={14} className="text-primary" />
          <span className="font-inter text-xs text-primary font-medium tracking-wide">Игровой компас</span>
        </div>
        <h1 className="font-syne text-4xl font-extrabold leading-[1] tracking-tight mb-3">
          Найди игру под настроение
        </h1>
        <p className="font-inter text-base text-muted-foreground max-w-xl leading-relaxed">
          Отметь теги — компас покажет игры, которые подходят хотя бы под один из выбранных. Чем больше тегов, тем шире результаты.
        </p>
      </div>

      <div className="space-y-5 mb-8">
        {CATEGORIES.map((cat) => (
          <div key={cat.key}>
            <div className="flex items-center gap-2 mb-2.5">
              <Icon name={cat.icon as "Swords"} size={14} className="text-muted-foreground" />
              <span className="font-inter text-xs uppercase tracking-widest text-muted-foreground">
                {cat.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TAGS[cat.key].map((tag) => {
                const active = selected[cat.key].includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(cat.key, tag)}
                    className={`
                      px-3 py-1.5 rounded-full font-inter text-xs border
                      ${active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border"
                      }
                    `}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-5 pb-4 border-b border-border">
        <div className="font-inter text-sm text-muted-foreground">
          Найдено: <span className="text-foreground font-semibold">{filtered.length}</span>
          {allSelected.length > 0 && (
            <span className="ml-2 text-xs">• выбрано тегов: {allSelected.length}</span>
          )}
        </div>
        {allSelected.length > 0 && (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 text-xs font-inter text-muted-foreground"
          >
            <Icon name="X" size={12} />
            Сбросить
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mb-4">
            <Icon name="SearchX" size={20} className="text-muted-foreground" />
          </div>
          <h3 className="font-syne text-base font-semibold mb-1">Ничего не нашлось</h3>
          <p className="font-inter text-sm text-muted-foreground">Попробуй убрать часть тегов.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((game) => (
            <div
              key={game.title}
              className="bg-card border border-border rounded-lg overflow-hidden flex flex-col"
            >
              <div
                className="aspect-[4/5] bg-secondary bg-cover bg-center"
                style={{ backgroundImage: `url(${game.cover})` }}
              />
              <div className="p-3 flex-1 flex flex-col">
                <div className="font-syne font-semibold text-sm leading-tight mb-1 truncate">
                  {game.title}
                </div>
                <div className="font-inter text-xs text-muted-foreground mb-2">{game.year}</div>
                <div className="flex flex-wrap gap-1 mt-auto">
                  {game.tags.genre.slice(0, 2).map((g) => (
                    <span
                      key={g}
                      className="px-1.5 py-0.5 rounded text-[10px] font-inter bg-secondary text-muted-foreground"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameCompass;
