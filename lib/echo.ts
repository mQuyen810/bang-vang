import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: typeof Echo;
  }
}

if (typeof window !== 'undefined') {
  window.Pusher = Pusher;
}

const echo = new Echo({
  broadcaster: 'reverb',
  key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || '',
  wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || '',
  wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080),
  wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080),
  forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
  enabledTransports: ['ws', 'wss'],
});

export default echo;
