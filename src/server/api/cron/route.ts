export function GET(request: Request){
    console.log('Cron job triggered at', new Date().toISOString());
    return new Response('Hello from Vercel!');
}