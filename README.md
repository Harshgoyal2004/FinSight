# FinSight - Personal Finance Dashboard

## Overview

FinSight is a comprehensive personal finance dashboard built with Next.js and Firebase, designed to help users track expenses, manage budgets, monitor investments, and gain AI-powered financial insights.

## Features

- **Expense Visualization**: Interactive charts and graphs for clear understanding of spending patterns
- **Budget Tracking**: Set and monitor budgets across different categories
- **Investment Portfolio**: Track investments with live stock data integration
- **AI Financial Insights**: Gemini-powered analysis of spending habits and investment data
- **Threshold Alerts**: Notifications when spending or investments exceed predefined thresholds

## Tech Stack

- **Frontend**: Next.js 15 with React 18
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: React Query for server state
- **AI Integration**: GenKit AI with Google AI capabilities
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Lucide React for consistent iconography

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd FinSight
```

2. Install dependencies

```bash
npm install
```

3. Run the development server

```bash
npm run dev
```

The application will be available at http://localhost:9002

### AI Development

To work with the AI features:

```bash
npm run genkit:dev   # Start the GenKit AI server
# or
npm run genkit:watch  # Start with auto-reload on changes
```

## Project Structure

- `/src/app`: Main application pages and routes
- `/src/components`: Reusable UI components
- `/src/ai`: AI integration and models
- `/src/lib`: Utility functions and mock data
- `/src/hooks`: Custom React hooks
- `/src/types`: TypeScript type definitions

## Design Guidelines

- **Primary Color**: Calm teal (#4DB6AC) - promotes trust and stability
- **Secondary Color**: Light grey (#EEEEEE) - ensures content readability
- **Accent Color**: Bright orange (#FF8A65) - for call-to-action elements
- **UI Philosophy**: Clean, minimalist layout with subtle transitions

## License

[MIT License](LICENSE)

## Acknowledgements

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
- AI capabilities powered by [GenKit](https://genkit.dev/) and [Google AI](https://ai.google.dev/)
