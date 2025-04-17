# HookProof - Advanced Phishing Detection Tool

HookProof is a web application that analyzes URLs for potential phishing threats using VirusTotal API and pattern recognition with regex.

## Features

- URL analysis with VirusTotal integration
- Pattern recognition using regex to detect common phishing techniques
- Comprehensive security reports
- Domain information analysis
- Personalized security recommendations

## Installation and Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- VirusTotal API key

### Setting Up on Linux

1. **Clone the repository**

   \`\`\`bash
   git clone https://github.com/yourusername/hookproof.git
   cd hookproof
   \`\`\`

2. **Install dependencies**

   \`\`\`bash
   npm install
   # or
   yarn
   \`\`\`

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   \`\`\`
   VIRUSTOTAL_API_KEY=your_virustotal_api_key_here
   \`\`\`

   You can obtain a VirusTotal API key by signing up at [VirusTotal](https://www.virustotal.com/).

4. **Start the development server**

   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

   The application will be available at http://localhost:3000

### Production Deployment

1. **Build the application**

   \`\`\`bash
   npm run build
   # or
   yarn build
   \`\`\`

2. **Start the production server**

   \`\`\`bash
   npm start
   # or
   yarn start
   \`\`\`

## Troubleshooting

### VirusTotal API Issues

- Make sure your API key is correctly set in the `.env.local` file
- Check that you haven't exceeded the API rate limits
- Verify your internet connection
- The free tier of VirusTotal API has limitations on the number of requests

### No Results or Incorrect Risk Assessment

If you're experiencing issues with:
- Always getting "High Risk" even for safe URLs
- VirusTotal integration not working

Try the following:

1. Check the browser console logs for any errors
2. Verify your API key is correct
3. Restart the application
4. If using Node.js v17+, you might need to add the `--openssl-legacy-provider` flag:

   \`\`\`bash
   NODE_OPTIONS=--openssl-legacy-provider npm run dev
   \`\`\`

5. Make sure your firewall isn't blocking outgoing connections to VirusTotal's API

## Using a Proxy (if VirusTotal is blocked)

If you're unable to access VirusTotal API due to network restrictions:

1. Set up a proxy in your `.env.local` file:

   \`\`\`
   HTTPS_PROXY=http://your-proxy-server:port
   \`\`\`

2. Modify the fetch calls in `lib/virustotal.ts` to use the proxy if needed

## License

[MIT License](LICENSE)
