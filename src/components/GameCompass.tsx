import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";

type TagCategory = "genre" | "platform" | "mood" | "mode";

interface Game {
  title: string;
  date: string;
  cover: string;
  description: string;
  rating: number;
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
  { title: "Baldur's Gate 3", date: "Aug 3, 2023", cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400", description: "Эпическая RPG по правилам D&D с глубокой историей, тактическими боями и большой свободой выбора.", rating: 5, tags: { genre: ["RPG", "Приключение"], platform: ["PC", "PlayStation", "Xbox"], mood: ["Атмосферная", "Напряжённая"], mode: ["Одиночная", "Кооператив", "Мультиплеер"] } },
  { title: "Elden Ring", date: "Feb 25, 2022", cover: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400", description: "Открытый мир от создателей Dark Souls — суровые битвы, мрачные пейзажи и тайны на каждом шагу.", rating: 5, tags: { genre: ["RPG", "Souls-like", "Открытый мир"], platform: ["PC", "PlayStation", "Xbox"], mood: ["Напряжённая", "Атмосферная"], mode: ["Одиночная", "Кооператив"] } },
  { title: "Hollow Knight", date: "Feb 24, 2017", cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400", description: "Атмосферная метроидвания о падшем королевстве жуков с тонким геймплеем и грустной музыкой.", rating: 5, tags: { genre: ["Метроидвания", "Платформер"], platform: ["PC", "PlayStation", "Xbox", "Switch"], mood: ["Атмосферная", "Медитативная"], mode: ["Одиночная"] } },
  { title: "Resident Evil 4 Remake", date: "Mar 24, 2023", cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400", description: "Переосмысленный хоррор-шутер от третьего лица — выживание, паразиты и испанская деревня.", rating: 5, tags: { genre: ["Хоррор", "Шутер"], platform: ["PC", "PlayStation", "Xbox"], mood: ["Напряжённая"], mode: ["Одиночная"] } },
  { title: "Stardew Valley", date: "Feb 26, 2016", cover: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=400", description: "Уютная ферма-симулятор, в которой можно жить, ловить рыбу, копать шахты и заводить семью.", rating: 5, tags: { genre: ["Симулятор"], platform: ["PC", "PlayStation", "Xbox", "Switch", "Мобильные"], mood: ["Расслабляющая", "Медитативная"], mode: ["Одиночная", "Кооператив"] } },
  { title: "Cyberpunk 2077", date: "Dec 10, 2020", cover: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400", description: "Футуристическая RPG в неоновом Найт-Сити — киберимпланты, корпорации и личная история наёмника.", rating: 4, tags: { genre: ["RPG", "Шутер", "Открытый мир"], platform: ["PC", "PlayStation", "Xbox"], mood: ["Атмосферная", "Динамичная"], mode: ["Одиночная"] } },
  { title: "It Takes Two", date: "Mar 26, 2021", cover: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=400", description: "Только кооператив — двое игроков проходят сказочное приключение, спасая семью.", rating: 5, tags: { genre: ["Платформер", "Приключение"], platform: ["PC", "PlayStation", "Xbox", "Switch"], mood: ["Весёлая"], mode: ["Кооператив", "Сплит-скрин"] } },
  { title: "Doom Eternal", date: "Mar 20, 2020", cover: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400", description: "Быстрый и брутальный шутер о войне с демонами под безумный метал-саундтрек.", rating: 5, tags: { genre: ["Шутер"], platform: ["PC", "PlayStation", "Xbox", "Switch"], mood: ["Динамичная", "Напряжённая"], mode: ["Одиночная", "Мультиплеер"] } },
  { title: "Forza Horizon 5", date: "Nov 9, 2021", cover: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400", description: "Аркадные гонки по красочной Мексике с открытым миром и сотнями машин.", rating: 5, tags: { genre: ["Гонки", "Открытый мир"], platform: ["PC", "Xbox"], mood: ["Расслабляющая", "Динамичная"], mode: ["Одиночная", "Мультиплеер"] } },
  { title: "Hades", date: "Sep 17, 2020", cover: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400", description: "Рогалик о побеге из греческого ада — драйв, стиль и отличная история между забегами.", rating: 5, tags: { genre: ["RPG", "Приключение"], platform: ["PC", "PlayStation", "Xbox", "Switch"], mood: ["Динамичная", "Атмосферная"], mode: ["Одиночная"] } },
  { title: "Civilization VI", date: "Oct 21, 2016", cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400", description: "Пошаговая стратегия — построй цивилизацию от каменного века до космической эры.", rating: 4, tags: { genre: ["Стратегия"], platform: ["PC", "PlayStation", "Xbox", "Switch", "Мобильные"], mood: ["Медитативная"], mode: ["Одиночная", "Мультиплеер"] } },
  { title: "Tekken 8", date: "Jan 26, 2024", cover: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400", description: "Зрелищный 3D-файтинг с глубокой механикой и эпичной семейной драмой Мисима.", rating: 4, tags: { genre: ["Файтинг"], platform: ["PC", "PlayStation", "Xbox"], mood: ["Напряжённая", "Динамичная"], mode: ["Одиночная", "Мультиплеер"] } },
  { title: "Animal Crossing: New Horizons", date: "Mar 20, 2020", cover: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400", description: "Симулятор жизни на острове — собирай, обустраивай и приглашай друзей в гости.", rating: 4, tags: { genre: ["Симулятор"], platform: ["Switch"], mood: ["Расслабляющая", "Весёлая"], mode: ["Одиночная", "Мультиплеер"] } },
  { title: "Alan Wake 2", date: "Oct 27, 2023", cover: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", description: "Психологический сюжетный хоррор — расследование, ночные кошмары и кинематографичная подача.", rating: 5, tags: { genre: ["Хоррор", "Приключение"], platform: ["PC", "PlayStation", "Xbox"], mood: ["Атмосферная", "Напряжённая"], mode: ["Одиночная"] } },
  { title: "Genshin Impact", date: "Sep 28, 2020", cover: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400", description: "Аниме-RPG в открытом мире Тейвата с гача-героями и регулярными обновлениями.", rating: 4, tags: { genre: ["RPG", "Открытый мир"], platform: ["PC", "PlayStation", "Мобильные"], mood: ["Атмосферная", "Расслабляющая"], mode: ["Одиночная", "Кооператив"] } },
  { title: "Apex Legends", date: "Feb 4, 2019", cover: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400", description: "Командный battle royale с уникальными героями и динамичной перестрелкой.", rating: 4, tags: { genre: ["Шутер"], platform: ["PC", "PlayStation", "Xbox", "Switch", "Мобильные"], mood: ["Динамичная", "Напряжённая"], mode: ["Мультиплеер", "Кооператив"] } },
  { title: "Hollow Wake", date: "May 14, 2024", cover: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400", description: "Тёмная метроидвания с хоррор-уклоном и нелинейным исследованием мира.", rating: 4, tags: { genre: ["Метроидвания", "Хоррор"], platform: ["PC", "Switch"], mood: ["Атмосферная"], mode: ["Одиночная"] } },
  { title: "Lethal Company", date: "Oct 24, 2023", cover: "https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400", description: "Кооперативный хоррор — собирай металлолом на заброшенных лунах и не попади чудовищам.", rating: 5, tags: { genre: ["Хоррор", "Приключение"], platform: ["PC"], mood: ["Напряжённая", "Весёлая"], mode: ["Кооператив", "Мультиплеер"] } },
  { title: "Persona 5 Royal", date: "Mar 31, 2020", cover: "https://images.unsplash.com/photo-1606092677800-30c43e3d9b8d?w=400", description: "Стильная японская RPG о школьниках-фантомах, ворующих сердца злодеев.", rating: 5, tags: { genre: ["RPG"], platform: ["PC", "PlayStation", "Xbox", "Switch"], mood: ["Атмосферная"], mode: ["Одиночная"] } },
  { title: "Among Us", date: "Jun 15, 2018", cover: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400", description: "Социальная игра про команду на космолёте и предателя среди своих.", rating: 4, tags: { genre: ["Приключение"], platform: ["PC", "PlayStation", "Xbox", "Switch", "Мобильные"], mood: ["Весёлая"], mode: ["Мультиплеер"] } },
  { title: "Sea of Thieves", date: "Mar 20, 2018", cover: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400", description: "Пиратская песочница в открытом море — корабли, кракены и поиски сокровищ.", rating: 4, tags: { genre: ["Приключение", "Открытый мир"], platform: ["PC", "Xbox", "PlayStation"], mood: ["Весёлая", "Атмосферная"], mode: ["Кооператив", "Мультиплеер"] } },
  { title: "Mario Kart 8 Deluxe", date: "Apr 28, 2017", cover: "https://images.unsplash.com/photo-1591105327764-4d2a4c990a09?w=400", description: "Лучшие картинг-гонки от Nintendo с трассами, синими черепахами и весельем для всей семьи.", rating: 5, tags: { genre: ["Гонки"], platform: ["Switch"], mood: ["Весёлая", "Динамичная"], mode: ["Одиночная", "Мультиплеер", "Сплит-скрин"] } },
  { title: "Disco Elysium", date: "Oct 15, 2019", cover: "https://images.unsplash.com/photo-1572177812156-58036aae439c?w=400", description: "Текстовая детективная RPG о детективе с амнезией в депрессивном городе.", rating: 5, tags: { genre: ["RPG", "Приключение"], platform: ["PC", "PlayStation", "Xbox", "Switch"], mood: ["Атмосферная", "Медитативная"], mode: ["Одиночная"] } },
  { title: "StarCraft II", date: "Jul 27, 2010", cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&sat=-100", description: "Культовая стратегия в реальном времени — три расы, киберспорт и эпичная кампания.", rating: 5, tags: { genre: ["Стратегия"], platform: ["PC"], mood: ["Напряжённая", "Динамичная"], mode: ["Одиночная", "Мультиплеер"] } },
  { title: "Microsoft Flight Simulator", date: "Aug 18, 2020", cover: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400", description: "Реалистичный авиасимулятор — лети куда угодно над фотореалистичной Землёй.", rating: 5, tags: { genre: ["Симулятор"], platform: ["PC", "Xbox"], mood: ["Медитативная", "Расслабляющая"], mode: ["Одиночная", "Мультиплеер"] } },
];

const Stars = ({ value }: { value: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Icon
        key={i}
        name="Star"
        size={14}
        className={i <= value ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/40"}
      />
    ))}
  </div>
);

const GameCard = ({ game, rank, match, featured }: { game: Game; rank: number; match: number; featured?: boolean }) => {
  const matchColor = "bg-violet-500";
  const matchText = "text-emerald-400";

  return (
    <div
      className={`
        relative rounded-2xl p-4 bg-card border transition-colors
        ${featured ? "border-yellow-400/60 shadow-[0_0_0_1px_rgba(250,204,21,0.15)]" : "border-border hover:border-muted-foreground/40"}
      `}
    >
      <div className="flex gap-4">
        <div
          className="w-24 h-32 rounded-lg bg-secondary bg-cover bg-center shrink-0"
          style={{ backgroundImage: `url(${game.cover})` }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="min-w-0">
              <h3 className="font-syne font-bold text-base leading-tight truncate">
                {game.title}
              </h3>
              <p className="font-inter text-xs text-muted-foreground mt-0.5">{game.date}</p>
            </div>

            {!featured && (
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full ${matchColor} rounded-full`}
                      style={{ width: `${match}%` }}
                    />
                  </div>
                  <span className={`font-inter text-xs font-semibold ${matchText}`}>
                    +{match.toFixed(2)}%
                  </span>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  <Icon name="Heart" size={16} />
                </button>
                <button className="text-muted-foreground hover:text-foreground">
                  <Icon name="EyeOff" size={16} />
                </button>
              </div>
            )}
          </div>

          <p className="font-inter text-sm text-muted-foreground leading-snug line-clamp-2 mt-2">
            {game.description}
          </p>

          {featured ? (
            <div className="mt-3 flex items-center justify-between gap-3">
              <Stars value={game.rating} />
              <button className="px-3 py-1.5 rounded bg-yellow-400 text-black font-syne text-xs font-bold tracking-wider">
                SEED
              </button>
            </div>
          ) : (
            <div className="mt-3">
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground font-inter text-[11px] font-medium tracking-wider hover:text-foreground">
                <Icon name="ChevronDown" size={12} />
                TAG MATCH
              </button>
            </div>
          )}
        </div>
      </div>

      {!featured && (
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-syne text-xs text-muted-foreground font-semibold">#{rank}</span>
            <Stars value={game.rating} />
          </div>
          <button className="px-3 py-1.5 rounded border border-border font-syne text-[11px] font-bold tracking-wider text-muted-foreground hover:text-foreground hover:border-muted-foreground">
            GAMES LIKE {game.title.toUpperCase().slice(0, 14)}{game.title.length > 14 ? "…" : ""}
          </button>
        </div>
      )}
    </div>
  );
};

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

  const matchFor = (i: number) => Math.max(5, 30 - i * 1.7) + (i % 3) * 0.38;

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
                      px-3 py-1.5 rounded-full font-inter text-xs border transition-colors
                      ${active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border hover:text-foreground"
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
            className="inline-flex items-center gap-1.5 text-xs font-inter text-muted-foreground hover:text-foreground"
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
        <div className="flex flex-col gap-3">
          {filtered.map((game, i) => (
            <GameCard
              key={game.title}
              game={game}
              rank={i}
              match={matchFor(i)}
              featured={i === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GameCompass;
