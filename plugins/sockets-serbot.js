import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import ws from 'ws';

export class YotsubaJadiBot {
    constructor() {
        this.socket = null;
        this.state = null;
        this.isConnected = false;
        this.user = null;
    }

    async connect(authFolder = 'auth') {
        try {
            // تحميل حالة المصادقة
            const { state, saveCreds } = await useMultiFileAuthState(authFolder);
            this.state = state;
            
            // جلب أحدث إصدار
            const { version, isLatest } = await fetchLatestBaileysVersion();
            
            // إنشاء الاتصال
            this.socket = makeWASocket({
                version,
                printQRInTerminal: true,
                auth: state,
                browser: ['YotsubaBot-MD', 'Chrome', '1.0.0'],
                logger: console,
                markOnlineOnConnect: true
            });
            
            // حفظ بيانات المصادقة
            this.socket.ev.on('creds.update', saveCreds);
            
            this.setupEventListeners();
            await this.waitForConnection();
            
            console.log('✅ YotsubaJadiBot connected successfully');
            return this.socket;
            
        } catch (error) {
            console.error('❌ Connection error:', error);
            throw error;
        }
    }

    setupEventListeners() {
        this.socket.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect, qr } = update;
            
            if (qr) {
                console.log('📱 QR Code received');
            }
            
            if (connection === 'close') {
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401; // إذا لم يكن خطأ مصادقة
                console.log('Connection closed, reconnecting...', lastDisconnect.error);
                
                if (shouldReconnect) {
                    setTimeout(() => this.connect(), 5000);
                }
            } else if (connection === 'open') {
                this.isConnected = true;
                this.user = this.socket.user;
                console.log('✅ Connection opened successfully');
            }
        });

        this.socket.ev.on('messages.upsert', async (m) => {
            if (!m.messages || m.type !== 'notify') return;
            
            const message = m.messages[0];
            console.log('📨 New message received:', message);
            
            // يمكنك إضافة معالجة الرسائل هنا
        });
    }

    async waitForConnection() {
        return new Promise((resolve) => {
            const checkConnection = () => {
                if (this.isConnected && this.user) {
                    resolve(this.socket);
                } else {
                    setTimeout(checkConnection, 1000);
                }
            };
            checkConnection();
        });
    }

    async sendMessage(jid, content, options = {}) {
        if (!this.isConnected) {
            throw new Error('Bot is not connected');
        }
        return await this.socket.sendMessage(jid, content, options);
    }

    async disconnect() {
        if (this.socket) {
            await this.socket.end();
            this.isConnected = false;
            this.user = null;
            console.log('🔌 Bot disconnected');
        }
    }

    // دالة للحصول على معلومات البوت (مثل التي في handler)
    getBotInfo() {
        if (!this.user) return null;
        
        return {
            jid: this.user.jid,
            name: this.user.name || 'YotsubaBot',
            platform: this.user.platform || 'Web'
        };
    }
}

// تصدير الكلاس
export default YotsubaJadiBot;