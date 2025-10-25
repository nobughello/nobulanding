import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { Resend } from "resend";
import { z } from "zod";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : new Resend("re_SLhc2wqR_Co5an9AdEftBHjfGzSWrAwi9");

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Form submission router
  form: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email().optional(),
          phone: z.string().min(1),
          city: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        try {
          console.log("[Form Submit] Received submission:", { name: input.name, city: input.city });
          
          if (!resend) {
            console.log("[Form Submit] Resend API key not configured - form submission logged to console");
            console.log("=== FORM SUBMISSION ===");
            console.log("Name:", input.name);
            console.log("Phone:", input.phone);
            console.log("City:", input.city);
            console.log("Email:", input.email || "Not provided");
            console.log("Submitted at:", new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" }));
            console.log("=====================");
            
            return { success: true, message: "Form submitted successfully (logged to console)" };
          }
          
          console.log("[Form Submit] Attempting to send email...");
          
          // Send email notification to owner
          const result = await resend.emails.send({
            from: "NoBug Pest Control <onboarding@resend.dev>",
            to: "nobughello@gmail.com",
            subject: `🐜 New Pest Control Lead from ${input.city}`,
            reply_to: "nobughello@gmail.com",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px;">🐜 New Pest Control Lead</h1>
                </div>
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <h2 style="color: #059669; margin-top: 0;">Customer Details</h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Name:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${input.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Phone:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;"><a href="tel:${input.phone}" style="color: #059669; text-decoration: none;">${input.phone}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">City:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${input.city}</td>
                    </tr>
                    ${input.email ? `
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Email:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;"><a href="mailto:${input.email}" style="color: #059669; text-decoration: none;">${input.email}</a></td>
                    </tr>
                    ` : ""}
                    <tr>
                      <td style="padding: 10px 0; font-weight: bold; color: #374151;">Submitted:</td>
                      <td style="padding: 10px 0; color: #111827;">${new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })}</td>
                    </tr>
                  </table>
                  
                  <div style="margin-top: 30px; padding: 20px; background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 5px;">
                    <h3 style="color: #059669; margin-top: 0;">🚀 Action Required</h3>
                    <p style="margin: 0; color: #374151;">Please contact this customer within 1 hour as promised on the website.</p>
                  </div>
                </div>
                <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
                  <p>NoBug Pest Control - Professional extermination services</p>
                </div>
              </div>
            `,
          });
          
          console.log("[Form Submit] Email sent successfully:", result);

          // Also send confirmation email to customer (if email provided)
          if (input.email) {
            try {
              await resend.emails.send({
                from: "NoBug Pest Control <onboarding@resend.dev>",
                to: input.email,
                subject: "🐜 תודה על פנייתך - נובאג הדברה",
                reply_to: "nobughello@gmail.com",
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                    <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                      <h1 style="margin: 0; font-size: 24px;">🐜 תודה על פנייתך!</h1>
                    </div>
                    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      <h2 style="color: #059669; margin-top: 0;">שלום ${input.name},</h2>
                      <p style="color: #374151; line-height: 1.6;">תודה רבה על פנייתך לשירותי ההדברה שלנו. קיבלנו את הפרטים שלך ואנחנו נחזור אליך תוך שעה.</p>
                      
                      <div style="margin: 30px 0; padding: 20px; background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 5px;">
                        <h3 style="color: #059669; margin-top: 0;">📞 מה קורה עכשיו?</h3>
                        <ul style="color: #374151; margin: 0; padding-left: 20px;">
                          <li>נחזור אליך תוך שעה</li>
                          <li>נקבע פגישה נוחה לך</li>
                          <li>נגיע עם כל הציוד הנדרש</li>
                          <li>נפתור את בעיית המזיקים שלך</li>
                        </ul>
                      </div>
                      
                      <p style="color: #374151;">אם יש לך שאלות דחופות, תוכל להתקשר אלינו בכל עת.</p>
                      <p style="color: #374151; margin-bottom: 0;">תודה,<br>צוות נובאג הדברה</p>
                    </div>
                    <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
                      <p>נובאג הדברה - שירותי הדברה מקצועיים</p>
                    </div>
                  </div>
                `,
              });
              console.log("[Form Submit] Customer confirmation email sent");
            } catch (confirmError) {
              console.error("[Form Submit] Failed to send customer confirmation:", confirmError);
              // Don't fail the main submission if confirmation email fails
            }
          }

          return { success: true };
        } catch (error) {
          console.error("Failed to send email:", error);
          throw new Error("Failed to send notification");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
