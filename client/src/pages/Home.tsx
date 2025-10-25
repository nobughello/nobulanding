import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState, FormEvent, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion, useScroll, useTransform } from "framer-motion";

// Google Analytics types
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

// Israeli cities list (unique cities only)
const israeliCities = [
  "תל אביב-יפו", "ירושלים", "חיפה", "ראשון לציון", "פתח תקווה", "נתניה", "באר שבע", "חולון", "רמת גן", "אשדוד",
  "הרצליה", "כפר סבא", "רחובות", "אשקלון", "בת ים", "קרית גת", "אילת", "נהריה", "טבריה", "נצרת",
  "עכו", "קרית שמונה", "דימונה", "אריאל", "מעלה אדומים", "קרית מלאכי", "לוד", "רמלה", "יבנה", "גבעתיים",
  "קרית אונו", "רעננה", "הוד השרון", "כפר יונה", "מגדל העמק", "קרית ביאליק", "קרית ים", "קרית מוצקין", "נשר", "טירת כרמל",
  "יקנעם", "עפולה", "נצרת עילית", "כרמיאל", "צפת", "מעלות-תרשיחא",
  "שפרעם", "אום אל-פחם", "טייבה", "קלנסווה", "טירה", "גדרה",
  "ערד", "מצפה רמון", "מיתר", "להבים", "עומר", "תל שבע", "רהט", "לכיש",
  "שדרות", "אופקים", "נתיבות", "שדה בוקר"
];

export default function Home() {
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    area: "",
    date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const { scrollYProgress } = useScroll();
  const chaosOpacity = useTransform(scrollYProgress, [0.15, 0.25], [1, 0]);
  const reliefOpacity = useTransform(scrollYProgress, [0.15, 0.25], [0, 1]);

  const submitForm = async (data: { name: string; phone: string; city: string }) => {
    try {
      const response = await fetch('/.netlify/functions/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    console.log("Form submission started with data:", formData);
    
    // Validate phone number before submission
    if (!validatePhone(formData.phone)) {
      setPhoneError("מספר הטלפון חייב להכיל 10 ספרות ולהתחיל ב-05");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const submissionData = {
        name: formData.name,
        phone: formData.phone,
        city: formData.area,
      };
      
      console.log("Submitting form with data:", submissionData);
      
      await submitForm(submissionData);
      
      console.log("Form submitted successfully!");
      
      // Track form submission in Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'form_submit', {
          event_category: 'engagement',
          event_label: 'pest_control_lead',
          value: 1
        });
      }
      
      toast.success("הטופס נשלח בהצלחה!");
      setLocation("/thank-you");
      
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("שגיאה בשליחת הטופס. אנא נסה שוב.");
      setIsSubmitting(false);
    }
  };

  const validatePhone = (phone: string) => {
    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if it's exactly 10 digits and starts with 05
    if (cleanPhone.length === 10 && cleanPhone.startsWith('05')) {
      return true;
    }
    return false;
  };

  const handlePhoneChange = (value: string) => {
    // Only allow digits
    const cleanValue = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limitedValue = cleanValue.slice(0, 10);
    
    setFormData((prev) => ({ ...prev, phone: limitedValue }));
    
    // Validate and set error
    if (limitedValue.length > 0) {
      if (!validatePhone(limitedValue)) {
        if (limitedValue.length < 10) {
          setPhoneError("מספר הטלפון חייב להכיל 10 ספרות");
        } else if (!limitedValue.startsWith('05')) {
          setPhoneError("מספר הטלפון חייב להתחיל ב-05");
        } else {
          setPhoneError("מספר טלפון לא תקין");
        }
      } else {
        setPhoneError("");
      }
    } else {
      setPhoneError("");
    }
  };

  const handleChange = (field: string, value: string) => {
    if (field === 'phone') {
      handlePhoneChange(value);
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleWhatsApp = () => {
    // Track WhatsApp click in Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'engagement',
        event_label: 'whatsapp_contact',
        value: 1
      });
    }
    window.open("https://wa.me/972545936560", "_blank");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed WhatsApp Bubble */}
      <motion.button
        onClick={handleWhatsApp}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl flex items-center justify-center text-3xl transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        💬
      </motion.button>

      {/* 1️⃣ HERO SECTION */}
      <section className="relative min-h-[80vh] md:min-h-[85vh] lg:min-h-[90vh] bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 overflow-hidden">
        {/* Floating Animated Insects */}
        <div className="absolute top-20 left-10">
          <motion.div
            className="text-4xl"
            animate={{
              y: [0, -20, 0, 0],
              x: [0, 0, 0, -2, 2, -2, 2, 0],
              rotate: [0, 10, 0, -10, 10, -10, 10, 0],
              opacity: [0.2, 0.2, 0.2, 0.25, 0],
              scale: [1, 1, 1, 0.8, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.3, 0.6, 0.85, 1],
            }}
          >
            🐜
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-5xl text-red-600 font-bold"
            animate={{
              opacity: [0, 0, 0, 1, 0],
              scale: [0, 0, 0, 1.5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.3, 0.6, 0.85, 1],
            }}
          >
            ✕
          </motion.div>
        </div>
        <div className="absolute top-40 right-20">
          <motion.div
            className="text-5xl"
            animate={{
              y: [0, 20, 0, 0],
              x: [0, 0, 0, 2, -2, 2, -2, 0],
              rotate: [0, -10, 0, 10, -10, 10, -10, 0],
              opacity: [0.2, 0.2, 0.2, 0.25, 0],
              scale: [1, 1, 1, 0.8, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
              times: [0, 0.3, 0.6, 0.85, 1],
            }}
          >
            🪳
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-6xl text-red-600 font-bold"
            animate={{
              opacity: [0, 0, 0, 1, 0],
              scale: [0, 0, 0, 1.5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
              times: [0, 0.3, 0.6, 0.85, 1],
            }}
          >
            ✕
          </motion.div>
        </div>
        <div className="absolute bottom-40 left-1/4">
          <motion.div
            className="text-3xl"
            animate={{
              y: [0, -15, 0, 0],
              x: [0, 10, 0, -2, 2, -2, 2, 0],
              rotate: [0, 0, 0, -12, 12, -12, 12, 0],
              opacity: [0.2, 0.2, 0.2, 0.25, 0],
              scale: [1, 1, 1, 0.8, 0],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
              times: [0, 0.3, 0.6, 0.85, 1],
            }}
          >
            🦟
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-4xl text-red-600 font-bold"
            animate={{
              opacity: [0, 0, 0, 1, 0],
              scale: [0, 0, 0, 1.5, 0],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
              times: [0, 0.3, 0.6, 0.85, 1],
            }}
          >
            ✕
          </motion.div>
        </div>

        <div className="container max-w-6xl mx-auto px-5 py-10 md:py-12 lg:py-16 relative z-10">
          <div className="text-center space-y-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center"
            >
              <img 
                src="/logo.png" 
                alt="NoBug Extermination" 
                className="h-48 md:h-60 lg:h-72 w-auto"
              />
            </motion.div>

            {/* Main Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-green-950 leading-tight"
            >
              יש לכם בעיית מזיקים<br />
              ואתם צריכים מדביר-עכשיו!
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-2xl md:text-3xl text-green-700 font-medium"
            >
              אנחנו יודעים, בגלל זה אתם פה, תנו לנו לסגור לכם את הפינה
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
            >
              <Button
                size="lg"
                onClick={() => {
                  // Track CTA click in Google Analytics
                  if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'click', {
                      event_category: 'engagement',
                      event_label: 'cta_order_now',
                      value: 1
                    });
                  }
                  const form = document.getElementById("lead-form");
                  form?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-xl font-bold px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all"
              >
                📞 הזמן הדברה עכשיו
              </Button>
              <Button
                size="lg"
                onClick={handleWhatsApp}
                variant="outline"
                className="w-full sm:w-auto bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 text-xl font-bold px-10 py-7 rounded-full shadow-lg"
              >
                💬 דברו איתנו בווטסאפ
              </Button>
            </motion.div>

            {/* Micro-trust */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-green-700 text-sm md:text-base"
            >
              זמינות בכל הארץ • תגובה תוך שעה
            </motion.p>
          </div>
        </div>
      </section>

      {/* 2️⃣ PROBLEM STORY */}
      <section className="py-16 md:py-24 bg-green-50">
        <div className="container max-w-3xl mx-auto px-5">
          <div className="space-y-8 text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-xl md:text-2xl text-green-900 leading-relaxed"
            >
              כל שנה אותו סיפור.<br />
              המזיקים חוזרים, ואתם שוב צריכים להתחיל לחפש מדביר.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-green-900 leading-relaxed"
            >
              אולי תתקשרו לזה משנה שעברה?<br />
              רגע, איפה הטלפון שלו בכלל?<br />
              ואולי הוא לא זמין?<br />
              ואולי הוא העלה מחיר?
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-green-900 leading-relaxed"
            >
              מצאתם את המספר? התקשרתם?<br />
              הוא לא עונה?<br />
              אז מתי יחזור אליכם? היום, מחר, אולי בעוד יומיים?
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-green-600"
            >
              ובינתיים? המזיקים אצלכם בבית או בעסק חוגגים!
            </motion.p>
          </div>
        </div>
      </section>

      {/* Internet Chaos */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-3xl mx-auto px-5">
          <div className="space-y-8 text-center">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-green-950"
            >
              טוב, הגיע הזמן לחפש מדביר באינטרנט.
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-green-900 leading-relaxed"
            >
              אבל יש כל כך הרבה.<br />
              מי מהם באמת אמין? מי בכלל עונה?<br />
              אלה שלא עונים, אלה שיכולים רק עוד יומיים...
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl font-bold text-green-950"
            >
              ואתם צריכים פתרון <span className="text-green-600">עכשיו</span>!
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-green-900"
            >
              בזמן שהמזיקים 🐜 רק מתרבים אצלכם בבית או בעסק.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="text-2xl md:text-3xl font-bold text-green-600"
            >
              כמה אנרגיה, כמה התעסקות, כמה זמן נשרף, למה???
            </motion.p>
          </div>
        </div>
      </section>

      {/* 3️⃣ CHAOS → RELIEF TRANSITION */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <motion.div
          style={{ opacity: chaosOpacity }}
          className="absolute inset-0 bg-gray-200 flex items-center justify-center"
        >
          <div className="text-6xl md:text-9xl opacity-30">🐜🪳🦟</div>
        </motion.div>
        <motion.div
          style={{ opacity: reliefOpacity }}
          className="absolute inset-0 bg-gradient-to-r from-green-600 to-teal-600"
        />
        <div className="relative z-10 container max-w-4xl mx-auto px-5 text-center">
          <motion.h3
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6"
          >
            💡 אפשר אחרת.
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl text-white font-medium"
          >
            בשביל זה אנחנו פה, סוגרים לכם את הפינה.
          </motion.p>
        </div>
      </section>

      {/* 4️⃣ SOLUTION / BENEFITS GRID */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-6xl mx-auto px-5">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-green-950 text-center mb-12"
          >
            למה נובאג?
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: "✅", title: "500+ מדבירים מקצועיים", desc: "רשת ארצית של מומחים מוסמכים" },
              { icon: "🧼", title: "חומרים בטוחים", desc: "לילדים ולחיות מחמד" },
              { icon: "🕐", title: "זמינות מיידית", desc: "בכל הארץ, בכל שעה" },
              { icon: "💬", title: "שירות מקצועי ואדיב", desc: "תמיכה מלאה לאורך כל הדרך" },
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full border-green-100 hover:shadow-lg transition-shadow rounded-3xl">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="text-5xl">{benefit.icon}</div>
                    <h4 className="text-xl font-bold text-green-950">{benefit.title}</h4>
                    <p className="text-green-800">{benefit.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button
              size="lg"
              onClick={() => {
                const form = document.getElementById("lead-form");
                form?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-xl font-bold px-10 py-7 rounded-full shadow-xl"
            >
              🐜 הזמן הדברה עכשיו
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 5️⃣ SOCIAL PROOF & REVIEWS */}
      <section className="py-16 md:py-24 bg-teal-50">
        <div className="container max-w-6xl mx-auto px-5">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-green-950 text-center mb-12"
          >
            למה לבחור בנו?
          </motion.h3>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-green-100 rounded-3xl shadow-md">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-5xl">⭐</div>
                  <h4 className="text-2xl font-bold text-green-950">4.9 כוכבים</h4>
                  <p className="text-green-800">דירוג ממוצע בגוגל</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full border-green-100 rounded-3xl shadow-md">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-5xl">🏅</div>
                  <h4 className="text-2xl font-bold text-green-950">רישיון רשמי</h4>
                  <p className="text-green-800">מהמשרד להגנת הסביבה</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-green-100 rounded-3xl shadow-md">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-5xl">📍</div>
                  <h4 className="text-2xl font-bold text-green-950">3,542+</h4>
                  <p className="text-green-800">בתים ועסקים שטופלו בהצלחה</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Google-Style Reviews */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-green-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      ש
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-bold text-green-950">שרה כהן</h5>
                        <div className="text-yellow-500 text-lg">⭐⭐⭐⭐⭐</div>
                      </div>
                      <p className="text-green-800 text-sm mb-2">"תוך שעה היה אצלנו מדביר מקצועי. הטיפול היה יסודי והמחיר הוגן. סוף סוף שקט מהנמלים!"</p>
                      <p className="text-green-600 text-xs">לפני שבועיים</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-green-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      ד
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-bold text-green-950">דוד לוי</h5>
                        <div className="text-yellow-500 text-lg">⭐⭐⭐⭐⭐</div>
                      </div>
                      <p className="text-green-800 text-sm mb-2">"שירות מעולה! המדביר הגיע בזמן, עבד בצורה מקצועית והסביר הכל. ממליץ בחום!"</p>
                      <p className="text-green-600 text-xs">לפני חודש</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-green-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      מ
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-bold text-green-950">מיכל אברהם</h5>
                        <div className="text-yellow-500 text-lg">⭐⭐⭐⭐⭐</div>
                      </div>
                      <p className="text-green-800 text-sm mb-2">"פתרון מהיר ויעיל לבעיית התיקנים שלנו. החומרים בטוחים לילדים. תודה רבה!"</p>
                      <p className="text-green-600 text-xs">לפני 3 שבועות</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6️⃣ LEAD FORM */}
      <section id="lead-form" className="py-16 md:py-24 bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50">
        <div className="container max-w-2xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-2xl border-2 border-green-200 bg-white rounded-3xl">
              <CardContent className="p-8 md:p-12">
                <div className="space-y-6">
                  {/* Form Header */}
                  <div className="text-center space-y-3">
                    <h3 className="text-3xl md:text-4xl font-extrabold text-green-950">
                      🐜 מלאו את הטופס עכשיו<br />ומדביר בדרך אליכם!
                    </h3>
                    <p className="text-green-700 text-lg">תגובה תוך שעה מובטחת</p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-green-900 font-semibold text-base">
                        שם מלא *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="איך קוראים לך?"
                        className="text-right border-green-200 focus:border-green-500 h-14 text-lg rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-green-900 font-semibold text-base">
                        טלפון *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="0501234567"
                        className={`text-right h-14 text-lg rounded-xl ${
                          phoneError 
                            ? "border-red-500 focus:border-red-500" 
                            : "border-green-200 focus:border-green-500"
                        }`}
                        dir="ltr"
                      />
                      {phoneError && (
                        <p className="text-red-500 text-sm text-right">{phoneError}</p>
                      )}
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="area" className="text-green-900 font-semibold text-base">
                        אזור מגורים *
                      </Label>
                      <Select
                        value={formData.area}
                        onValueChange={(value) => handleChange("area", value)}
                        required
                      >
                        <SelectTrigger className="text-right border-green-200 focus:border-green-500 h-14 text-lg rounded-xl">
                          <SelectValue placeholder="בחר עיר" />
                        </SelectTrigger>
                        <SelectContent>
                          {israeliCities.map((city) => (
                            <SelectItem key={city} value={city} className="text-right">
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-green-900 font-semibold text-base">
                        מתי נוח לכם? *
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => handleChange("date", e.target.value)}
                        className="text-right border-green-200 focus:border-green-500 h-14 text-lg rounded-xl"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting || !!phoneError}
                      className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-2xl font-bold py-8 rounded-full shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "שולח..." : "📞 שלח ומדביר בדרך אליך!"}
                    </Button>
                  </form>

                  {/* Trust Indicators */}
                  <div className="text-center text-sm text-green-600 space-y-2 pt-4">
                    <p className="flex items-center justify-center gap-2">
                      <span>🔒</span>
                      <span>המידע שלך מאובטח לחלוטין</span>
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <span>⚡</span>
                      <span>תגובה תוך שעה מובטחת</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* 7️⃣ FINAL CTA BAND */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="container max-w-4xl mx-auto px-5 text-center space-y-8">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold"
          >
            🚀 לחיים נקיים ממזיקים.
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-bold"
          >
            נובאג — סוגרים לכם את הפינה.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => {
                const form = document.getElementById("lead-form");
                form?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="w-full sm:w-auto bg-white text-green-700 hover:bg-green-50 text-xl font-bold px-10 py-7 rounded-full shadow-xl"
            >
              🐜 מלאו את הטופס עכשיו
            </Button>
            <Button
              size="lg"
              onClick={handleWhatsApp}
              variant="outline"
              className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10 text-xl font-bold px-10 py-7 rounded-full"
            >
              📞 דברו איתנו עכשיו
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 8️⃣ FOOTER */}
      <footer className="bg-green-950 text-white py-12">
        <div className="container max-w-6xl mx-auto px-5">
          <div className="text-center space-y-6">
            {/* Logo */}
            <div className="flex items-center justify-center">
              <img 
                src="/nobug-logo.png" 
                alt="NoBug Extermination" 
                className="h-20 md:h-24 w-auto"
              />
            </div>

            {/* Footer Text */}
            <p className="text-green-300 text-sm md:text-base">
              הדברה לבית ולעסק | מדבירים מוסמכים | זמינות 24/7 | שירות עם אחריות
            </p>

            {/* Contact */}
            <div className="text-green-400 text-sm space-y-1">
              <p>📧 nobughello@gmail.com</p>
              <p>💬 שירות לקוחות זמין תמיד</p>
            </div>

            {/* Copyright */}
            <div className="border-t border-green-800 pt-6 text-green-300 text-xs">
              <p>© 2025 נובאג - כל הזכויות שמורות</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

