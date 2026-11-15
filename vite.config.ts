import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { serveEvents } from './api/events.mjs';

export default defineConfig(({mode})=>{
  const env = loadEnv(mode, '.', 'TOUR_API_KEY');
  const eventApi: Plugin = {
    name:'moa-event-api',
    configureServer(server) {
      server.middlewares.use('/api/events',(req,res)=>{ void serveEvents(req,res,env.TOUR_API_KEY); });
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/events',(req,res)=>{ void serveEvents(req,res,env.TOUR_API_KEY); });
    },
  };
  return {plugins:[react(),tailwindcss(),eventApi]};
});
