# Setup Guide - Relational Risk Insight

## Quick Start

The application is already configured and ready to use! Here's what you need to know:

## What's Already Set Up

✅ **Supabase Database**
- Tables created: `sessions`, `messages`, `red_flags`
- Row Level Security (RLS) policies configured
- Indexes optimized for performance

✅ **Edge Function**
- `therapy-chat` function deployed
- CORS configured for secure communication
- Ready to process therapy sessions

✅ **Frontend Application**
- React + TypeScript + Tailwind CSS
- All components built and styled
- Responsive design implemented

## Using the Application

### Option 1: User-Provided API Key (Recommended for Development)

Users can provide their own OpenAI API key when starting a session:

1. Click "Have your own OpenAI API key?" on the welcome screen
2. Enter the API key (starts with `sk-...`)
3. The key is used only for that session and never stored

### Option 2: Configure Server-Side API Key (Recommended for Production)

To set up a default OpenAI API key in your Edge Function:

1. Go to your Supabase Dashboard
2. Navigate to Edge Functions → Secrets
3. Add a secret named `OPENAI_API_KEY` with your OpenAI API key
4. The function will automatically use this key when users don't provide their own

**Note**: According to Supabase guidelines, secrets are automatically configured. If you need to update the OpenAI API key, use the Supabase Dashboard.

## Getting an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key (it starts with `sk-...`)
6. **Important**: You won't be able to see it again, so save it securely

## Running the Application

### Development Mode

```bash
npm run dev
```

The app will start on `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## Environment Variables

The `.env` file contains:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

These are already configured and working.

## Testing the Application

1. Open the application in your browser
2. Click "Begin Therapy Session"
3. If prompted, provide an OpenAI API key (optional if server-side key is configured)
4. Start chatting with the AI therapist
5. After 10+ exchanges, click "View Analysis" to see your risk dashboard

## Minimum Requirements for Analysis

- At least 10 user messages in the conversation
- The AI will automatically detect red flags during the conversation
- You can complete the session at any time after meeting the minimum

## Troubleshooting

### "OpenAI API key not configured" Error

**Solution**: Either:
1. Provide an API key when starting the session, or
2. Configure the `OPENAI_API_KEY` secret in Supabase Edge Functions

### Edge Function Not Responding

**Check**:
1. Edge function is deployed: `supabase/functions/therapy-chat`
2. CORS headers are properly configured
3. Supabase project is active

### Database Connection Issues

**Verify**:
1. `.env` file has correct Supabase URL and anon key
2. Database tables exist (sessions, messages, red_flags)
3. RLS policies allow anonymous access

## API Rate Limits

OpenAI API has rate limits based on your account tier:
- Free tier: Limited requests per minute
- Paid tier: Higher limits

If you encounter rate limit errors, wait a moment and try again.

## Cost Considerations

Each therapy session uses OpenAI API credits:
- Approximate cost: $0.01 - $0.05 per session
- Depends on conversation length
- GPT-4 pricing: ~$0.03 per 1K tokens

## Browser Compatibility

The application works best on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Privacy & Data

- All conversations are stored in your Supabase database
- No data is sent to third parties except OpenAI for AI processing
- User API keys are never stored permanently
- Sessions are anonymous by default

## Next Steps

1. **Customize the AI Prompt**: Edit the `SYSTEM_PROMPT` in `supabase/functions/therapy-chat/index.ts`
2. **Adjust Scoring Weights**: Modify values in `src/lib/scoringEngine.ts`
3. **Customize UI**: Update colors in `tailwind.config.js`
4. **Add Authentication**: Implement Supabase Auth for user accounts

## Support

For technical issues or questions:
1. Check the main README for architecture details
2. Review Supabase logs in the Dashboard
3. Check browser console for client-side errors

## Deployment

To deploy to production:

1. **Frontend**: Deploy to Vercel, Netlify, or any static host
2. **Database**: Already on Supabase
3. **Edge Functions**: Already deployed on Supabase

The application is designed to work seamlessly in production with minimal configuration.
