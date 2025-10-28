# TalkMate Translator

TalkMate is a Next.js app that helps you learn and translate Japanese with Gemini. Switch between a conversational **Learn** mode and a concise **Translate** mode, and optionally attach images for OCR-assisted translations.

## Features
- Interactive chat interface with persistent conversation history per mode.
- Two conversation styles: friendly tutoring or direct translations.
- Image upload support; images are sent to Gemini as inline data for analysis.
- Light and dark theme styling built with Tailwind CSS.

## Tech Stack
- Next.js 16 (App Router)
- React 19
- Tailwind CSS
- Google Gemini via `@google/genai`
