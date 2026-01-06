const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = 3000;

// Middleware
app.use(compression()); // Enable GZIP compression
app.use(cors());
app.use(express.json());

// Static files with caching headers
app.use(express.static(path.join(__dirname), {
    maxAge: '1d', // Cache static files for 1 day
    etag: true,
    setHeaders: (res, filePath) => {
        // Long cache for images and videos
        if (filePath.match(/\.(jpg|jpeg|png|gif|webp|mp4|svg)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=604800'); // 7 days
        }
        // Short cache for HTML
        if (filePath.match(/\.html$/)) {
            res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour
        }
    }
}));

// Google Sheets Configuration
const SPREADSHEET_ID = '1laNmzAhUHJpkm-DTqzn0fsZxZNZ7S-Du2-_m7WFDYc8';
const SHEET_NAME = 'leads';

// Load credentials
const credentials = require('./credentials.json');

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

// API endpoint to save lead
app.post('/api/lead', async (req, res) => {
    try {
        const { name, phone, whatsapp, governorate, address, quantity, total } = req.body;
        
        // Generate order number
        const orderNumber = Math.floor(1000 + Math.random() * 9000);
        const timestamp = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });
        
        // Get offer details based on quantity
        let offerDetails = '';
        if (quantity === '1') offerDetails = 'قطعة واحدة - 2,200 ج.م';
        else if (quantity === '2') offerDetails = 'قطعتين - 3,999 ج.م (وفر 9%)';
        else if (quantity === '3') offerDetails = '3 قطع - 5,599 ج.م (وفر 15%)';
        
        // Prepare row data matching exact sheet columns:
        // تاريخ الطلب | الاسم | رقم الهاتف | رقم الواتس | المحافظة | المنطقة | العنوان | تفاصيل الطلب | الكمية | توتال السعر شامل الشحن | اسم المنتج | الحالة | ملاحظات | المصدر | ارسال واتس اب | Lead ID | المسؤول
        const values = [[
            timestamp,           // تاريخ الطلب
            name,                // الاسم
            phone,               // رقم الهاتف
            whatsapp,            // رقم الواتس
            governorate,         // المحافظة
            '',                  // المنطقة (فارغة)
            address,             // العنوان
            offerDetails,        // تفاصيل الطلب
            quantity,            // الكمية
            '',                  // توتال السعر شامل الشحن (فارغة)
            'غمازة السيارات',  // اسم المنتج
            'جديد',              // الحالة
            '',                  // ملاحظات (فارغة)
            '',                  // المصدر (فارغة)
            '',                  // ارسال واتس اب (فارغة)
            '',                  // Lead ID (فارغة)
            ''                   // المسؤول (فارغة)
        ]];

        // Append to Google Sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A:Q`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values }
        });

        console.log(`✅ Lead saved: Order #${orderNumber} - ${name}`);
        
        res.json({ 
            success: true, 
            orderNumber,
            message: 'تم حفظ الطلب بنجاح'
        });

    } catch (error) {
        console.error('❌ Error saving lead:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'حدث خطأ أثناء حفظ الطلب'
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 LED Matrix Egypt Server Running!
📍 http://localhost:${PORT}
📊 Google Sheets Integration Active
    `);
});
