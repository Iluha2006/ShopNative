# ShopsReactNative

**Мобильное приложение интернет-магазина кроссовок** с full-stack архитектурой на React Native (Expo) и Laravel.

## Предметная область

Приложение представляет собой полнофункциональный e-commerce магазин обуви. Пользователи могут просматривать каталог кроссовок, фильтровать товары по названию, просматривать детальную информацию (несколько изображений, описание, цена, размерная сетка), добавлять товары в корзину и избранное, оформлять заказы с оплатой через Stripe.

## Архитектура

### Frontend (`ReactNativeApp/`)
- **React Native 0.81** + **Expo 54** — мобильный клиент
- **React Navigation** (Bottom Tabs + Stack) — навигация (5 вкладок: Главная, Поиск, Корзина, Избранное, Профиль)
- **Redux Toolkit** — управление состоянием (auth, cart, favorites, products, payment, profile)
- **@stripe/stripe-react-native** — интеграция платежей
- **TypeScript / JavaScript** — код приложения

### Backend (`Sneakers-Shop/`)
- **Laravel 12** + **PHP 8.2** — REST API сервер
- **Laravel Sanctum** — токен-аутентификация
- **PostgreSQL** — база данных (10+ таблиц: users, profiles, products, carts, favorites, orders, etc.)
- **Stripe PHP SDK** — обработка платежей

## API

Клиент взаимодействует с сервером через REST API (`/api`):
- `auth/*` — регистрация, логин, логаут
- `products` — CRUD + фильтрация по категориям
- `cart/*` — управление корзиной (auth required)
- `favorites/*` — управление избранным (auth required)
- `profile/*` — профиль пользователя (auth required)
- `payment/*` — создание PaymentIntent через Stripe (auth required)

## Локальный запуск

### Backend
```bash
cd Sneakers-Shop
cp .env.example .env   # настроить подключение к БД и Stripe ключи
composer install
php artisan migrate
php artisan serve
```

### Frontend
```bash
cd ReactNativeApp
npm install
npx expo start
```
