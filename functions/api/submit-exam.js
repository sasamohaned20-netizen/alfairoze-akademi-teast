export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();

    const {
      studentName,
      levelTitleAr,
      totalQuestions = 100,
      answeredQuestions = 0,
      correctAnswers = 0,
      wrongAnswers = 0,
      unansweredQuestions = 0,
      score = 0,
      submissionType = 'manual',
    } = body;

    // Validate inputs
    if (!studentName || typeof studentName !== 'string' || studentName.trim().length < 2) {
      return new Response(JSON.stringify({ error: 'اسم الطالب غير صالح' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cleanName = studentName.trim();
    const cleanLevel = levelTitleAr || 'المستوى غير محدد';
    const statusText =
      submissionType === 'timeout'
        ? 'انتهى الوقت'
        : 'أنهى الطالب الاختبار قبل انتهاء الوقت';

    // Format the Telegram message
    const message = `📊 نتيجة امتحان أكاديمية الفيروز

👤 الطالب:
${cleanName}

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

    const botToken = env.TELEGRAM_BOT_TOKEN;
    const chatId = env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn('Telegram credentials missing in Cloudflare environment variables');
      return new Response(
        JSON.stringify({
          success: true,
          telegramSent: false,
          warning: 'Telegram credentials are not configured in Cloudflare environment variables',
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const tgRes = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    const tgData = await tgRes.json();

    return new Response(
      JSON.stringify({
        success: true,
        telegramSent: tgData.ok === true,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: true,
        telegramSent: false,
        error: err.message,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
