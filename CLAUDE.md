# CLAUDE.md

Цей файл надає інструкції Claude Code (claude.ai/code) для роботи з цим репозиторієм.

## Огляд проєкту

**Betblock v2.0** — це односторінковий застосунок (SPA) для управління виробництвом і обліку запасів на підприємстві з виробництва будівельних блоків. Інтерфейс — українською мовою. Весь застосунок міститься в одному файлі: `index-firebase-v2.html`.

## Як запустити

Відкрити `index-firebase-v2.html` безпосередньо в браузері — збірка не потрібна. Залежності (React 18, Tailwind CSS, Firebase, Babel, SheetJS) завантажуються з CDN. JSX компілюється в браузері через Babel Standalone.

Немає package.json, лінтера та тестового фреймворку.

## Архітектура

### Структура одного файлу

Весь HTML, CSS (Tailwind), React-компоненти та бізнес-логіка знаходяться в `index-firebase-v2.html` (~1800 рядків).

### Два режими роботи

- **Демо-режим**: дані зберігаються в `localStorage` (ключі: `inventory`, `products`, `production`, `orders`, `sales`, `expenses`, `currentUser`)
- **Firebase-режим**: синхронізація в реальному часі через Firestore; конфіг Firebase знаходиться на початку файлу (рядки 27–34)

### Ієрархія React-компонентів

```
LoginScreen
ProductionApp  (головний контейнер стану)
├── DashboardTab
├── InventoryTab
├── ProductsTab
├── ProductionTab
├── OrdersTab
├── SalesTab      (тільки admin/manager)
└── ExpensesTab   (тільки admin/manager)
```

Стан керується через React-хуки (`useState`, `useEffect`) і передається через props. Зовнішні бібліотеки стану не використовуються.

### Рольовий доступ

Три ролі, що зберігаються у Firestore `users/{uid}.role`:
- `admin` — повний доступ, включаючи управління користувачами
- `manager` — може редагувати дані, без управління користувачами
- `worker` — лише читання; може додавати записи виробництва

Допоміжні функції: `canEdit()` та `canViewFinances()`.

### Колекції Firestore

`inventory`, `products`, `production`, `orders`, `sales`, `expenses`, `users`

### Конфігурація Firebase

Замінити рядки-заповнювачі в об'єкті `firebaseConfig` на початку `index-firebase-v2.html` реальними даними проєкту. Правила безпеки Firestore описані у `ІНСТРУКЦІЯ-V2.md`.

## Документація

- `ІНСТРУКЦІЯ-V2.md` — повний посібник з налаштування: Firebase, правила Firestore, розгортання на Vercel
- `ШВИДКА-ДОВІДКА-V2.md` — швидка довідка: огляд функцій, демо-облікові дані, поради
