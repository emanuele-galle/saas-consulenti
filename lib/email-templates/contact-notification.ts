function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface ContactNotificationData {
  consultantName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  isExistingClient: boolean;
}

export function contactNotificationTemplate(data: ContactNotificationData): string {
  const safe = {
    consultantName: escapeHtml(data.consultantName),
    firstName: escapeHtml(data.firstName),
    lastName: escapeHtml(data.lastName),
    email: escapeHtml(data.email),
    phone: data.phone ? escapeHtml(data.phone) : null,
    message: data.message ? escapeHtml(data.message) : null,
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#C21D17;padding:24px 32px;">
              <h1 style="color:#ffffff;margin:0;font-size:20px;">Nuova richiesta di contatto</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;color:#333;font-size:15px;">
                Ciao <strong>${safe.consultantName}</strong>,
              </p>
              <p style="margin:0 0 24px;color:#333;font-size:15px;">
                Hai ricevuto una nuova richiesta di contatto dalla tua landing page.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9;border-radius:6px;padding:16px;">
                <tr>
                  <td style="padding:8px 16px;">
                    <p style="margin:0;color:#666;font-size:13px;">Nome</p>
                    <p style="margin:2px 0 0;color:#333;font-size:15px;font-weight:bold;">${safe.firstName} ${safe.lastName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 16px;">
                    <p style="margin:0;color:#666;font-size:13px;">Email</p>
                    <p style="margin:2px 0 0;color:#333;font-size:15px;"><a href="mailto:${safe.email}" style="color:#C21D17;">${safe.email}</a></p>
                  </td>
                </tr>
                ${safe.phone ? `
                <tr>
                  <td style="padding:8px 16px;">
                    <p style="margin:0;color:#666;font-size:13px;">Telefono</p>
                    <p style="margin:2px 0 0;color:#333;font-size:15px;"><a href="tel:${safe.phone}" style="color:#C21D17;">${safe.phone}</a></p>
                  </td>
                </tr>
                ` : ""}
                ${safe.message ? `
                <tr>
                  <td style="padding:8px 16px;">
                    <p style="margin:0;color:#666;font-size:13px;">Messaggio</p>
                    <p style="margin:2px 0 0;color:#333;font-size:15px;">${safe.message}</p>
                  </td>
                </tr>
                ` : ""}
                <tr>
                  <td style="padding:8px 16px;">
                    <p style="margin:0;color:#666;font-size:13px;">Cliente esistente</p>
                    <p style="margin:2px 0 0;color:#333;font-size:15px;">${data.isExistingClient ? "Si" : "No"}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px;background-color:#f5f5f5;text-align:center;">
              <p style="margin:0;color:#999;font-size:12px;">
                MediaCom - Piattaforma Landing Page Consulenti
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
