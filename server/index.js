import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Telegram submission endpoint
app.post('/api/submit-exam', async (req, res) => {
  try {
    const {
      studentName,
      studentPhone,
      levelTitleAr,
      totalQuestions = 100,
      answeredQuestions = 0,
      correctAnswers = 0,
      wrongAnswers = 0,
      unansweredQuestions = 0,
      score = 0,
      submissionType = 'manual',
    } = req.body;

    // Validate inputs
    if (!studentName || typeof studentName !== 'string' || studentName.trim().length < 2) {
      return res.status(400).json({ error: 'اسم الطالب غير صالح' });
    }

    const cleanName = studentName.trim();
    const cleanPhone = studentPhone ? String(studentPhone).trim() : 'غير مسجل';
    const cleanLevel = levelTitleAr || 'المستوى غير محدد';
    const statusText =
      submissionType === 'timeout'
        ? 'انتهى الوقت'
        : 'أنهى الطالب الاختبار قبل انتهاء الوقت';

    // Format the Telegram message according to official prompt specifications
    const message = `📊 نتيجة امتحان أكاديمية الفيروز

👤 الطالب:
${cleanName}

📱 رقم الهاتف:
${cleanPhone}

📚 المستوى:
${cleanLevel}

📝 إجمالي الأسئلة:
${totalQuestions}

✏️ تم الحل:
${answeredQuestions}

✅ صحيح:
${correctAnswers}

❌ خطأ:
${wrongAnswers}

⚪ بدون إجابة:
${unansweredQuestions}

🎯 النتيجة:
${score} / ${totalQuestions}

⏱️ الحالة:
${statusText}`;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn(
        '⚠️ [Telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in .env. Message preview below:\n' +
          message
      );
      return res.json({
        success: true,
        telegramSent: false,
        warning: 'Telegram credentials are not configured on server',
      });
    }

    // Dispatch message to Telegram Bot API
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error('❌ [Telegram] API Error:', data);
      return res.json({
        success: true,
        telegramSent: false,
        error: data.description || 'فشل إرسال تقرير تيليجرام',
      });
    }

    console.log(`✅ [Telegram] Result message sent successfully for student: ${cleanName}`);
    return res.json({ success: true, telegramSent: true });
  } catch (error) {
    console.error('❌ [Server Error]:', error);
    // Return 200 with error flag so frontend is not broken
    return res.status(200).json({
      success: true,
      telegramSent: false,
      error: error instanceof Error ? error.message : 'خطأ غير متوقع بالخادم',
    });
  }
});

// Production: serve built static files from dist
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 [ALFAIROZE Exam Server] running on http://localhost:${PORT}`);
});
