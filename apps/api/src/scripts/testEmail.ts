import nodemailer from 'nodemailer';

async function testGmail() {
  const user = 'farahna.connect@gmail.com';
  const pass = 'rhllpussftltvpvu'; // stripped spaces from: rhll puss ftlt vpvu

  console.log(`Connecting to Gmail SMTP with user: ${user}...`);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP connection successfully verified with Gmail!');

    // Send a test email from farahna.connect@gmail.com to farahna.connect@gmail.com
    const info = await transporter.sendMail({
      from: `"منصة فرحنا | Farahna" <${user}>`,
      to: user,
      subject: '✨ تجربة نجاح ربط البريد الإلكتروني لمنصة فرحنا',
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; background-color: #FAF7F2; padding: 25px; border-radius: 12px; border: 1px solid #D4AF37;">
          <h2 style="color: #720925; margin-top: 0;">👑 تم اعتماد البريد الإلكتروني الرئيسي بنجاح!</h2>
          <p style="font-size: 15px; color: #333; line-height: 1.6;">
            أهلاً بحضرتك يا بشمهندس كريم،<br/>
            تم ربط وتفعيل حساب <strong>${user}</strong> بنجاح عبر App Password الخاص بـ Google.
          </p>
          <div style="background: #FFF; padding: 15px; border-radius: 8px; border: 1px solid #E5E0D8; margin: 15px 0;">
            <p style="margin: 5px 0; color: #555;"><strong>الحالة:</strong> متصل وجاهز للاستقبال والتحكم في السيستم بالكامل 🚀</p>
            <p style="margin: 5px 0; color: #555;"><strong>إشعارات الدفع:</strong> سيتم إرسال تنبيه فوري بالصورة والبيانات فور قيام أي عميل برفع إيصال دفع وإنشاء دعوة.</p>
          </div>
          <p style="font-size: 12px; color: #888; margin-bottom: 0;">منصة فرحنا (Farahna) — نظام الإشعارات والتحكم المركزي 💍</p>
        </div>
      `,
    });

    console.log(`✅ Test email sent successfully! MessageId: ${info.messageId}`);
  } catch (error) {
    console.error('❌ SMTP Error:', error);
  }
}

testGmail();
