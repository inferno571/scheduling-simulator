# Setup Instructions

## Google Gemini API Key Configuration

To use the AI Terminal Analyzer feature, you need to configure your Google Gemini API key.

### Steps:

1. **Get your API key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated API key

2. **Create environment file:**
   - Create a file named `.env.local` in the root directory of this project
   - Add the following line:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```
   - Replace `your_api_key_here` with your actual API key

3. **Restart the development server:**
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again

### Example `.env.local` file:
```
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Note:** Never commit `.env.local` to version control. It's already in `.gitignore`.

## Troubleshooting

If you see "GEMINI_API_KEY is not configured" error:
- Make sure the file is named exactly `.env.local` (not `.env` or `.env.example`)
- Make sure the file is in the root directory (same level as `package.json`)
- Restart your development server after creating/modifying the file
- Check that there are no extra spaces around the `=` sign

