// Eve — API configuration
//
// This is a LOCAL DEMO setup only. The Anthropic API key below is used
// directly from browser JavaScript (see js/eve.js), which means anyone
// who opens dev tools on this page can read it. That is fine for testing
// on your own machine, but this file must NEVER be:
//   - committed to a public repo
//   - deployed to a live/public website
//   - shared with anyone
//
// Before this site goes live for real users, Eve's API calls need to move
// behind a backend/serverless proxy that holds the key server-side instead.
//
// Get a key at https://console.anthropic.com/settings/keys

const EVE_CONFIG = {
  apiKey: '',
  model: 'claude-sonnet-5',

  // Optional: give Eve a cloned voice instead of the browser's default one.
  //   1. Go to elevenlabs.io, sign up, and open Voices -> Add Voice ->
  //      Instant Voice Cloning.
  //   2. Upload the voice samples there (ElevenLabs captures the speaker's
  //      consent as part of that flow) and name the voice.
  //   3. Open the new voice's details and copy its Voice ID.
  //   4. Get your API key from Settings -> API Keys.
  //   5. Paste both below. Leave them blank to use the browser's own voice.
  elevenLabsApiKey: '',
  elevenLabsVoiceId: ''
};
