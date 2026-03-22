# Betblock v3.0

Система управління виробництвом та обліку для підприємства з виробництва будівельних блоків.

**Production:** https://shlakoblock-ebf35.web.app

## Можливості

- **Дашборд** — лічильники, статистика по продукції, графік виробництва за 7 днів, попередження про низькі запаси, фінансовий підсумок
- **Склад** — облік сировини та матеріалів з попередженнями про мінімальний запас
- **Продукція** — каталог блоків з цінами
- **Виробництво** — журнал виробництва по змінах
- **Замовлення** — управління замовленнями зі статусами (Нове → Виробляється → Готове → Доставлено)
- **Продажі** — облік продажів з відміткою оплати
- **Витрати** — облік витрат по категоріях
- **Пошук і фільтри** — на всіх сторінках, фільтр по статусу/категорії
- **Експорт** — Excel та JSON backup
- **Dark mode** — перемикач теми
- **PWA** — встановлення на домашній екран, офлайн-доступ
- **Pull-to-refresh** — оновлення свайпом на мобільному
- **Toast нотифікації** — повідомлення при всіх діях
- **Зворотній зв'язок** — кнопка для відправки фідбеку
- **Аналітика** — Firebase Analytics + error tracking

## Стек технологій

| Технологія | Призначення |
|---|---|
| React 19 + TypeScript | UI фреймворк |
| Vite 8 | Збірка + code splitting |
| Tailwind CSS 4 | Стилі |
| Firebase Auth | Автентифікація (3 ролі) |
| Cloud Firestore | База даних (realtime sync) |
| Firebase Analytics | Аналітика подій |
| Firebase Hosting | Хостинг + CI/CD |
| recharts | Графіки |
| lucide-react | Іконки |
| sonner | Toast нотифікації |
| SheetJS | Експорт Excel |

## Швидкий старт

```bash
# Встановити залежності
npm install

# Запустити dev server
npm run dev

# Build для production
npm run build

# Deploy на Firebase
npx firebase-tools deploy --project shlakoblock-ebf35
```

Додаток автоматично запуститься в **демо-режимі** (дані в localStorage).

### Демо-акаунти

| Email | Роль | Доступ |
|---|---|---|
| `admin@example.com` | Адмін | Повний доступ |
| `manager@example.com` | Менеджер | Редагування, фінанси |
| `worker@example.com` | Працівник | Читання + виробництво |

Пароль: будь-який.

## Firebase (production)

### Конфігурація

Конфіг Firebase знаходиться у `src/services/firebase.ts`. Поточний проєкт: `shlakoblock-ebf35`.

### Firestore Security Rules

Правила безпеки знаходяться у `firestore.rules`. Деплой:

```bash
npx firebase-tools deploy --only firestore:rules --project shlakoblock-ebf35
```

### Колекції Firestore

| Колекція | Опис |
|---|---|
| `users` | Юзери з ролями (admin/manager/worker) |
| `inventory` | Матеріали на складі |
| `products` | Каталог продукції |
| `production` | Записи виробництва |
| `orders` | Замовлення клієнтів |
| `sales` | Продажі |
| `expenses` | Витрати |
| `errors` | Логи помилок (автоматично) |
| `feedback` | Зворотній зв'язок від юзерів |

## CI/CD

GitHub Actions автоматично деплоїть на Firebase Hosting:
- **Push to main** → production deploy
- **Pull Request** → preview channel deploy

Конфігурація: `.github/workflows/firebase-hosting-merge.yml`

## Структура проєкту

```
src/
├── App.tsx                    # Root: ErrorBoundary → Auth → Lazy TabRouter
├── main.tsx                   # Entry point
├── types/index.ts             # TypeScript інтерфейси
├── services/
│   ├── firebase.ts            # Firebase init + Analytics
│   ├── auth.ts                # Auth (demo + firebase mode)
│   └── firestore.ts           # CRUD + realtime subscriptions
├── contexts/
│   ├── AuthContext.tsx         # User + roles + permissions
│   └── DataContext.tsx         # 6 колекцій + CRUD з toasts
├── hooks/
│   ├── useDarkMode.ts         # Dark mode toggle
│   ├── useExport.ts           # Excel + JSON export
│   └── usePullToRefresh.ts    # Pull-to-refresh gesture
├── components/
│   ├── layout/                # AppShell, Header, BottomNav, Sidebar
│   ├── auth/                  # LoginScreen
│   ├── dashboard/             # Stats, Charts, Alerts, Counters
│   ├── inventory/             # Склад (Page + List + Form)
│   ├── products/              # Продукція (Page + Card + Form)
│   ├── production/            # Виробництво (Page + List + Form)
│   ├── orders/                # Замовлення (Page + List + Form + StatusBadge)
│   ├── sales/                 # Продажі (Page + List + Form)
│   ├── expenses/              # Витрати (Page + List + Form)
│   └── shared/                # FAB, Sheet, Search, Filters, ErrorBoundary, Feedback, PullToRefresh
├── lib/
│   ├── utils.ts               # cn(), formatDate(), formatCurrency()
│   ├── constants.ts           # Статуси, категорії, дефолти
│   └── stats.ts               # Розрахунок статистики
└── styles/globals.css         # Tailwind theme + dark mode + animations
```

## Ліцензія

Private project.
