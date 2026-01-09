# Relational Risk Insight

A sophisticated, LLM-powered web application that acts as a therapeutic AI companion for relationship analysis. The app provides comprehensive risk assessment through conversational therapy sessions, identifying red flags and offering actionable insights.

## Features

### Core Functionality

- **Therapeutic Chat Interface**: Calm, professional AI therapist that asks probing questions to understand relationship dynamics
- **Real-time Risk Analysis**: Continuous assessment across four key categories:
  - Communication
  - Trust
  - Emotional Intelligence
  - Future Alignment
- **Intelligent Red Flag Detection**: Weighted scoring system that identifies concerning patterns with varying severity levels
- **Comprehensive Risk Dashboard**: Beautiful, animated report featuring:
  - Overall risk score gauge (0-100%)
  - Category breakdown with visual indicators
  - Identified red flags with severity classifications
  - Investment recommendation
  - Actionable next steps

### Technical Highlights

- **Modern Architecture**: Provider Pattern with React Context for decoupled state management
- **Session Memory**: System maintains conversation history for contextual LLM responses
- **Weighted Scoring Engine**: Sophisticated algorithm that assigns different weights to red flag categories and severity levels
- **Database Persistence**: All sessions, messages, and red flags are stored in Supabase
- **Beautiful UI**: Modern Zen aesthetic with glassmorphism, smooth animations, and responsive design
- **Mobile Optimized**: Fully responsive from mobile to desktop

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom Modern Zen design system
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Edge Functions**: Supabase Edge Functions (Deno runtime)
- **LLM Integration**: OpenAI GPT-4 API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase project (already configured)
- OpenAI API key (optional - can be provided by users)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`

3. Database schema is already set up with:
   - `sessions` table for therapy sessions
   - `messages` table for conversation history
   - `red_flags` table for identified concerns

4. Edge function `therapy-chat` is deployed and ready

### Running the Application

Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## How It Works

### User Flow

1. **Welcome Screen**: User is greeted with feature overview and can optionally provide their OpenAI API key
2. **Therapy Session**: AI therapist engages in conversational analysis, asking thoughtful questions
3. **Minimum Exchanges**: At least 10 user messages required to unlock analysis
4. **Risk Dashboard**: Comprehensive report with scores, recommendations, and next steps

### Scoring Algorithm

The scoring engine evaluates relationships across multiple dimensions:

#### Severity Weights
- Low: 1x multiplier
- Medium: 2.5x multiplier
- High: 5x multiplier
- Critical: 10x multiplier

#### Category Weights (for overall score)
- Trust: 35%
- Communication: 30%
- Emotional Intelligence: 20%
- Future Alignment: 15%

#### Risk Levels
- 0-24%: Low Risk - Healthy Foundation
- 25-49%: Moderate Risk - Address Concerns
- 50-74%: High Risk - Proceed with Caution
- 75-100%: Critical Risk - Consider Ending

### AI Therapist Behavior

The AI is programmed to:
- Ask open-ended questions that encourage reflection
- Listen actively and validate feelings
- Identify concerning patterns without judgment
- Focus on communication, trust, emotional intelligence, and future alignment
- Detect red flags like gaslighting, love bombing, stonewalling, etc.

### Session Persistence

All data is automatically saved to Supabase:
- Session metadata (start time, completion status, risk score)
- Complete message history
- All identified red flags with categories and severity

## Design System

### Color Palette
- **Zen Gray**: Neutral tones (50-900)
- **Zen Indigo**: Primary accent (50-900)
- **Gradient Backgrounds**: Deep, calming color transitions

### UI Patterns
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Smooth Animations**: Framer Motion for entrance/exit animations
- **Responsive Typography**: Inter font family
- **Mobile-First**: Fully responsive with thoughtful breakpoints

## API Integration

### OpenAI Configuration

The app uses GPT-4 for therapeutic conversations. Users can either:
1. Provide their own API key (secure, session-only)
2. Use a pre-configured key (if set up in Edge Function environment)

The Edge Function at `supabase/functions/therapy-chat` handles:
- Conversation context management
- System prompt injection
- Red flag extraction from AI responses
- Error handling and CORS

## Database Schema

### Sessions Table
- `id`: Unique session identifier
- `started_at`: Session start timestamp
- `completed_at`: Session completion timestamp
- `is_complete`: Boolean completion status
- `risk_score`: Overall risk score (0-100)

### Messages Table
- `id`: Unique message identifier
- `session_id`: Foreign key to sessions
- `role`: 'user', 'assistant', or 'system'
- `content`: Message text
- `timestamp`: Message timestamp

### Red Flags Table
- `id`: Unique red flag identifier
- `session_id`: Foreign key to sessions
- `category`: Communication | Trust | Emotional Intelligence | Future Alignment
- `severity`: low | medium | high | critical
- `description`: Red flag description
- `weight`: Numeric weight (1-10)
- `detected_at`: Detection timestamp

## Security & Privacy

- Row Level Security (RLS) enabled on all tables
- Anonymous access supported for privacy
- API keys never stored, only used in-session
- CORS properly configured for secure API calls

## Disclaimer

This application is for educational and entertainment purposes only. It provides insights based on conversational analysis but is NOT a replacement for professional therapy or counseling. For serious relationship concerns, users should consult licensed mental health professionals.

## Future Enhancements

- User authentication for session history
- Export reports as PDF
- Multi-language support
- Voice input/output
- Comparison with previous sessions
- Professional therapist referral integration

## License

This project is private and proprietary.

## Support

For questions or issues, please contact the development team.
