import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ManifestOptions, VitePWA } from 'vite-plugin-pwa'

const gTesting : boolean = false;

// The content of the app's manifest file.
const manifest : Partial<ManifestOptions> = 
{
    short_name: "Sort Viz",
    name: "Sorting Visualiser (Image)",
    icons: 
    [
        {
            src: "/logo192.png",
            type: "image/png",
            sizes: "192x192"
        },
        {
            src: "/logo512.png",
            type: "image/png",
            sizes: "512x512",
            purpose: "any maskable"
        }
    ],
    start_url: gTesting ? "http://localhost:5173/" : "https://www.sort-viz-img.com/",
    display: "standalone",
    theme_color: "#000000",
    background_color: "#000000"
}

// https://vite.dev/config/
export default defineConfig(
    {
        build: {
            // Prevent files from being inlined in the JS. This can be a problem for sound files. https://stackoverflow.com/questions/69614671/vite-without-hash-in-filename
            assetsInlineLimit: 0,

            rollupOptions: {
                output: {
                    // Prevent renaming of files with hashes.
                    entryFileNames: `assets/[name].js`,
                    chunkFileNames: `assets/[name].js`,
                    assetFileNames: `assets/[name].[ext]`
                }
            },
            // watch: false
        },
        plugins: [
            react(),
            VitePWA(
                { 
                    registerType: 'autoUpdate', 
                    manifest: manifest,
                    devOptions: {
                        enabled: true,
                        type: "module",
                    },
                    workbox: {
                        globPatterns: [ '**/*.{js,css,html,mp3,webp}' ],
                    }
                }
            )
        ],
    }
)
