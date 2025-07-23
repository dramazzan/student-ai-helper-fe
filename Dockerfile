# Этап 1: сборка приложения
FROM node:18 AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем зависимости
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Собираем Next.js в продакшн-режиме
RUN npm run build

# Этап 2: продакшн-сервер
FROM node:18 AS runner

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем только необходимые файлы из сборочного контейнера
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Указываем переменные среды
ENV NODE_ENV production
ENV PORT 3000

# Открываем порт
EXPOSE 3000

# Запуск
CMD ["npm", "start"]
