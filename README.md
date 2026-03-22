# Betblock

Система управління виробництвом та обліку для підприємства з виробництва будівельних блоків.

## Можливості

- **Дашборд** — статистика виробництва, графік за 7 днів, попередження про низькі запаси, фінансовий підсумок
- **Склад** — облік сировини та матеріалів з попередженнями про мінімальний запас
- **Продукція** — каталог блоків з цінами
- **Виробництво** — журнал виробництва по змінах
- **Замовлення** — управління замовленнями зі статусами (Нове → Виробляється → Готове → Доставлено)
- **Продажі** — облік продажів з відміткою оплати
- **Витрати** — облік витрат по категоріях
- **Експорт** — Excel та JSON backup
- **Dark mode** — перемикач теми
- **PWA** — встановлення на домашній екран, офлайн-доступ

## Стек технологій

| Технологія | Призначення |
|---|---|
| React 19 + TypeScript | UI фреймворк |
| Vite 8 | Збірка |
| Tailwind CSS 4 | Стилі |
| Firebase Auth | Автентифікація |
| Cloud Firestore | База даних (realtime) |
| Firebase Analytics | Аналітика |
| Firebase Hosting | Хостинг |
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

Для підключення до Firebase відредагуйте конфіг у `src/services/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.firebasestorage.app',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
}
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuth() { return request.auth != null; }
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    function isAdmin() { return getUserRole() == 'admin'; }
    function isManager() { return getUserRole() == 'manager'; }
    function canEdit() { return isAdmin() || isManager(); }

    match /users/{userId} {
      allow read: if isAuth();
      allow write: if isAdmin();
    }
    match /inventory/{doc} { allow read: if isAuth(); allow write: if canEdit(); }
    match /products/{doc} { allow read: if isAuth(); allow write: if canEdit(); }
    match /production/{doc} { allow read: if isAuth(); allow write: if isAuth(); }
    match /orders/{doc} { allow read: if isAuth(); allow write: if canEdit(); }
    match /sales/{doc} { allow read: if isAuth() && canEdit(); allow write: if canEdit(); }
    match /expenses/{doc} { allow read: if isAuth() && canEdit(); allow write: if canEdit(); }
    match /errors/{doc} { allow create: if isAuth(); }
    match /feedback/{doc} { allow create: if isAuth(); allow read: if isAdmin(); }
  }
}
```

## CI/CD

GitHub Actions автоматично деплоїть на Firebase Hosting:
- **Push to main** → production deploy
- **Pull Request** → preview channel deploy

## Структура проєкту

```
src/
├── App.tsx                    # Root component + tab routing
├── types/                     # TypeScript інтерфейси
├── services/                  # Firebase, Auth, Firestore
├── contexts/                  # AuthContext, DataContext
├── hooks/                     # useDarkMode, useExport
├── components/
│   ├── layout/                # AppShell, Header, BottomNav, Sidebar
│   ├── auth/                  # LoginScreen
│   ├── dashboard/             # Stats, Charts, Alerts
│   ├── inventory/             # Склад
│   ├── products/              # Продукція
│   ├── production/            # Виробництво
│   ├── orders/                # Замовлення
│   ├── sales/                 # Продажі
│   ├── expenses/              # Витрати
│   └── shared/                # FAB, Sheet, Search, Filters, ErrorBoundary
└── lib/                       # Utils, Constants, Stats
```

## Ліцензія

Private project.
