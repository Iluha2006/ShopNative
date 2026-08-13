# ShopNative

**Мобильное приложение интернет-магазина кроссовок** с full-stack архитектурой: клиент на **React Native (Expo)** и REST API на **Laravel**.

---

## Предметная область

### 1. Описание

Проект относится к области **электронной коммерции (e-commerce)** — продаже обуви (кроссовок) через мобильное приложение. Магазин позволяет пользователю просматривать каталог товаров, выбирать размер, добавлять товары в корзину и избранное, оформлять заказ и оплачивать его банковской картой через платёжный провайдер **Stripe**.

### 2. Роли пользователей

| Роль | Возможности |
|------|-------------|
| **Гость** | Просмотр каталога, детальной страницы товара, фильтрация по категориям |
| **Авторизованный покупатель** | Всё, что доступно гостю, плюс: корзина, избранное, оформление и оплата заказа, управление профилем |
| **Администратор / владелец контента** | Создание, редактирование и удаление товаров, загрузка изображений |

### 3. Ключевые сущности

#### User (пользователь)
- `name`, `email`, `password` — учётные данные
- Аутентификация через **Laravel Sanctum** (token-based)

#### Profile (профиль)
- `user_id` → связь с пользователем
- `name`, `email`, `avatar` — публичные данные профиля

#### CategoryProduct (категория)
- Родительская сущность для группировки товаров (например: кроссовки, кеды, ботинки)

#### Product (товар)
- `name`, `description` — название и описание
- `price` — цена (десятичное число)
- `discount` — скидка в процентах
- `quantity` — количество на складе
- `imageUrl` — главное изображение
- `images_product` — галерея дополнительных изображений (JSON)
- `size` — доступная размерная сетка (JSON-массив, по умолчанию `37–44`)
- `category_id` → связь с категорией

#### Cart (корзина)
- `user_id`, `product_id` — пользователь и товар
- `quantity` — количество экземпляров
- `size` — выбранный размер
- `selected_image` — выбранное изображение товара

#### Favorite (избранное)
- `user_id`, `product_id` — отношение «пользователь сохранил товар»

#### ProductComment (отзыв)
- Комментарии покупателей к товару

#### Order (заказ)
- `user_id`, `product_id` — покупатель и товар
- `quantity`, `selected_size` — количество и выбранный размер
- `total_amount` — итоговая сумма заказа
- `status` — жизненный цикл заказа:

```
pending → success → completed
    ↘ cancelled
```

| Статус | Значение |
|--------|----------|
| `pending` | Заказ создан, ожидает оплаты |
| `success` | Оплата прошла успешно |
| `completed` | Заказ выполнен (завершён) |
| `cancelled` | Заказ отменён |

### 4. Связи между сущностями

```
User 1──1 Profile
User 1──N Cart          Cart   N──1 Product
User 1──N Favorite      Favorite N──1 Product
User 1──N Order         Order N──1 Product
Product N──1 CategoryProduct
Product 1──N ProductComment
```

### 5. Бизнес-процессы

1. **Регистрация / вход** — пользователь создаёт аккаунт и получает токен доступа (Sanctum).
2. **Просмотр каталога** — гость или пользователь просматривает товары, фильтрует по категории, открывает карточку товара (галерея изображений, цена со скидкой, размерная сетка).
3. **Управление корзиной** — добавление товара с выбранным размером, изменение количества, удаление, очистка.
4. **Избранное** — сохранение понравившихся товаров, проверка наличия товара в избранном.
5. **Оформление и оплата заказа** — создание `PaymentIntent` через Stripe, оплата картой, обновление статуса заказа по результату оплаты.
6. **Управление профилем** — редактирование имени/email, загрузка аватара.

---

## Архитектура

### Frontend — `ReactNativeApp/`
- **React Native 0.81** + **Expo SDK 54** (file-based routing, `expo-router`)
- **React Navigation** (Bottom Tabs + Stack) — навигация между экранами
- **Redux Toolkit + React Redux** — управление состоянием (auth, cart, favorites, products, payment, profile)
- **Axios** — HTTP-клиент для REST API
- **@stripe/stripe-react-native** — интеграция платежей Stripe
- **expo-secure-store** — безопасное хранение токенов и чувствительных данных

### Backend — `Sneakers-Shop/`
- **Laravel 12** + **PHP 8.2** — REST API
- **Laravel Sanctum** — токен-аутентификация
- **PostgreSQL** — БД (таблицы: `users`, `profiles`, `category_products`, `products`, `carts`, `favorites`, `product_comments`, `orders`, `personal_access_tokens`)
- **Stripe PHP SDK** — обработка платежей

## API

Клиент взаимодействует с сервером через REST API (`/api`):

| Группа | Методы |
|--------|--------|
| `auth` | `register`, `login`, `logout`, `user`, `refresh` |
| `products` | CRUD, `products/category/{id}` — фильтрация по категории, загрузка изображений |
| `cart` | `index`, `add`, `increment`, `decrement`, `delete`, `clear` |
| `favorites` | `index`, `add`, `check`, `delete`, `clear` |
| `profile` | `show`, `update`, `avatar`, `destroy` |
| `payment` | `create` (PaymentIntent), `success`, `cancel` |

Защищённые маршруты (корзина, избранное, профиль, оплата, логаут) требуют токен `auth:sanctum`.

---

## Структура проекта

```
ShopsReactNative/
├── ReactNativeApp/          # мобильный клиент (Expo / React Native)
│   ├── app/                 # экраны и навигация (file-based routing)
│   ├── assets/              # статические ресурсы
│   └── app.json             # конфигурация Expo
└── Sneakers-Shop/           # REST API (Laravel)
    ├── app/
    │   ├── Http/Controllers/   # контроллеры (Auth, Product, Cart, ...)
    │   ├── Http/Requests/      # валидация запросов
    │   ├── Models/             # Eloquent-модели
    │   └── Services/           # сервисы (Stripe payments)
    ├── database/
    │   ├── migrations/         # схема БД
    │   └── seeders/            # начальные данные
    └── routes/api.php          # маршруты API
```

## Локальный запуск

### Backend
```bash
cd Sneakers-Shop
cp .env.example .env          # настроить подключение к БД и Stripe ключи
composer install
php artisan migrate --seed
php artisan serve --host=0.0.0.0   # доступно для телефона/эмулятора по LAN
```

### Frontend
```bash
cd ReactNativeApp
npm install
npx expo start                # запуск в Expo Go / эмуляторе
```

---

