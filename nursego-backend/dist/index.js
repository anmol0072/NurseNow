"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Trigger Render Deployment 2
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const payments_routes_1 = __importDefault(require("./routes/payments.routes"));
const bookings_routes_1 = __importDefault(require("./routes/bookings.routes"));
const settings_routes_1 = __importDefault(require("./routes/settings.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/payments', payments_routes_1.default);
app.use('/api/bookings', bookings_routes_1.default);
app.use('/api/settings', settings_routes_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'NurseGo API is running smoothly' });
});
const https_1 = __importDefault(require("https"));
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    // Keep-Alive mechanism to prevent Render from sleeping and wiping SQLite DB
    const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL;
    if (RENDER_EXTERNAL_URL) {
        console.log(`Started Keep-Alive ping for ${RENDER_EXTERNAL_URL} every 10 minutes`);
        setInterval(() => {
            https_1.default.get(`${RENDER_EXTERNAL_URL}/health`, (res) => {
                console.log(`[Keep-Alive] Ping successful - Status: ${res.statusCode}`);
            }).on('error', (err) => {
                console.error('[Keep-Alive] Ping failed:', err.message);
            });
        }, 10 * 60 * 1000); // 10 minutes
    }
});
//# sourceMappingURL=index.js.map