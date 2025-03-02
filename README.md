# Manga Reader Bot

A Telegram bot built using Grammy and Deno. This bot interacts with a Manga API to fetch information about manga and its chapters. It allows users to search for manga and view details related to manga series directly on Telegram.

## Features

- `/start`: Initializes the bot and provides a welcome message.
- `/search`: Main functionality that lets users search for manga by name and get detailed information about it, including its chapters.

## Tech Stack

- **Grammy**: A fast and efficient Telegram bot framework for Deno.
- **Deno**: A secure runtime for JavaScript and TypeScript.
- **Manga API**: A third-party API used to fetch manga details and chapters.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/manga-bot.git
cd manga-bot
```

2. Install dependencies:

```bash
deno install
```

3. Create a .env file in the root directory and add your Telegram bot token, `HOST` is `WEBHOOK` for production and `POLLING` for development:

```env
TELEGRAM_TOKEN=your-telegram-bot-token
HOST=mode
```

4. Run the bot:

```bash
deno run --allow-net --allow-env --env bot.ts
```

### Commands
**/start**
This command initializes the bot and sends a welcome message to the user.

**/search**
Use this command to search for a manga by its name. The bot will return a list of manga matching the query, along with detailed information such as its chapters, status, and description.

### Development
If you want to contribute to the development of this bot, follow the steps below:

Fork the repository.
Create a feature branch (`git checkout -b feature-name`).
Commit your changes (`git commit -am 'Add new feature'`).
Push to the branch (`git push origin feature-name`).
Open a pull request.

### License
This project is licensed under the MIT License - see the LICENSE file for details.


