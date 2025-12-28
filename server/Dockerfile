FROM node:18

WORKDIR /app

# Устанавливаем инструменты для компиляции C/C++ кода
RUN apt-get update && \
    apt-get install -y build-essential python3

# Копируем package.json
COPY package*.json ./

# Устанавливаем зависимости (bcrypt скомпилируется)
RUN npm install

# Копируем остальной код
COPY . .

EXPOSE 5000
CMD ["npm", "start"]