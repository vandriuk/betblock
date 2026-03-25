# CLAUDE.md

Інструкції для Claude Code при роботі з цим репозиторієм.

## Огляд проєкту

**Betblock v3.0** — SPA для управління виробництвом та обліку на підприємстві з виробництва будівельних блоків. Інтерфейс — українською мовою. Mobile-first дизайн (цільовий пристрій — iPhone 13, 390×844).

## Стек

- **Vite + React 19 + TypeScript** — збірка та фреймворк
- **Tailwind CSS v4** — стилі (через `@tailwindcss/vite` плагін)
- **Firebase v12** — Auth + Firestore + Analytics + Hosting
- **lucide-react** — іконки
- **recharts** — графіки на дашборді
- **sonner** — toast нотифікації
- **xlsx (SheetJS)** — експорт в Excel

## Як запустити

```bash
npm install
npm run dev       # Dev server на localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build
```

## Два режими роботи

- **Firebase-режим** (за замовчуванням): Firestore + Auth. Конфіг у `src/services/firebase.ts`
- **Демо-режим**: localStorage, активується якщо Firebase не налаштовано. Демо-акаунти: `admin@example.com` / `manager@example.com` / `worker@example.com` (пароль: будь-який)

## Архітектура

### Структура

```
src/
├── App.tsx                         # Root: ErrorBoundary → AuthProvider → TabRouter
├── main.tsx                        # Entry point
├── types/index.ts                  # Всі TypeScript інтерфейси
├── services/
│   ├── firebase.ts                 # Firebase init + Analytics logEvent()
│   ├── auth.ts                     # signIn/signOut/onAuthStateChanged (demo + firebase)
│   └── firestore.ts                # Generic CRUD + realtime subscriptions (demo + firebase)
├── contexts/
│   ├── AuthContext.tsx              # User + role + canEdit()/canViewFinances()
│   └── DataContext.tsx              # 6 колекцій + addItem/updateItem/deleteItem з toasts
├── hooks/
│   ├── useDarkMode.ts              # Dark mode toggle + localStorage
│   └── useExport.ts                # Excel + JSON export
├── components/
│   ├── layout/                     # AppShell, Header, BottomNav, Sidebar
│   ├── auth/LoginScreen.tsx
│   ├── dashboard/                  # DashboardPage, StatsCards, InventoryAlerts, FinanceSummary, ProductionChart
│   ├── inventory/                  # InventoryPage + List + Form
│   ├── products/                   # ProductsPage + Card + Form
│   ├── production/                 # ProductionPage + List + Form
│   ├── orders/                     # OrdersPage + List + Form + StatusBadge
│   ├── sales/                      # SalesPage + List + Form
│   ├── expenses/                   # ExpensesPage + List + Form
│   └── shared/                     # FAB, Sheet, ConfirmDialog, EmptyState, SearchBar, StatusFilter, ErrorBoundary, FeedbackButton
├── lib/
│   ├── utils.ts                    # cn(), formatDate(), formatCurrency(), todayISO()
│   ├── constants.ts                # SHIFTS, ORDER_STATUSES, EXPENSE_CATEGORIES, defaults
│   └── stats.ts                    # calculateProductStats(), calculateFinancialStats()
└── styles/globals.css              # Tailwind @theme + dark mode overrides
```

### Path alias

`@/` → `./src/` (налаштовано в `vite.config.ts` + `tsconfig.app.json`)

### Навігація

Tab-based через `useState` в `App.tsx` — без React Router.
- **Мобільна**: BottomNav (5 вкладок) + "Ще" Sheet (Продажі, Витрати, Продукція)
- **Десктоп**: Sidebar зліва

### Рольовий доступ

Firestore `users/{uid}.role`:
- `admin` — повний доступ
- `manager` — редагування, без управління юзерами
- `worker` — читання + додавання виробництва

### Колекції Firestore

`inventory`, `products`, `production`, `orders`, `sales`, `expenses`, `users`, `errors`, `feedback`

## CI/CD

- GitHub Actions: `.github/workflows/firebase-hosting-merge.yml` (deploy on push to main)
- PR previews: `.github/workflows/firebase-hosting-pull-request.yml`
- Firebase project: `shlakoblock-ebf35`
- Secret: `FIREBASE_SERVICE_ACCOUNT_SHLAKOBLOCK_EBF35`

## PWA

- `public/manifest.json` — Web App Manifest
- `public/sw.js` — Service Worker (network-first, cache fallback)
- Іконки: `public/icon-192.png`, `public/icon-512.png`

## Аналітика

- **Firebase Analytics**: login, page_view, create_record, delete_record, export, feedback_sent
- **Error tracking**: ErrorBoundary → Firestore `errors` collection
- **Feedback**: FeedbackButton у Header → Firestore `feedback` collection

## Firestore Rules

`firestore.rules` — правила безпеки Firestore, деплояться через `firebase deploy --only firestore:rules`.

## Дизайн-система

### Кольори
- **Primary** (Industrial Blue): `#2d6bff` — основний, глибокий синій
- **Accent** (Amber/Copper): `#f97f07` — теплий акцент для попереджень та highlights
- Визначені через `@theme` в `src/styles/globals.css`

### Принципи UI
- **Touch targets**: мінімум 44×44px для всіх інтерактивних елементів (кнопки `w-11 h-11`)
- **Rounded**: `rounded-2xl` для карток, `rounded-xl` для кнопок та інпутів
- **Header**: лого + dark mode + role badge + меню "Інструменти" (export/feedback) + logout. Не більше 4-5 елементів в ряд
- **Backdrop blur**: `backdrop-blur-md` на Header і BottomNav для ефекту скла
- **Active feedback**: `active:scale-95` на всіх кнопках
- **Sheet**: `max-h-[85vh]`, safe-area bottom padding, drag-handle зверху
- **FAB**: `bottom-22` на мобілці (щоб не перекривати BottomNav)
- **Dark mode**: фон `#0c0f16`, картки `#161a24`, бордери `#252a36`
