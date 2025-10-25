import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function ThankYou() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50">
      {/* Main Content */}
      <div className="flex items-center justify-center p-4 min-h-[80vh]">
        {/* Success Card */}
        <Card className="max-w-2xl w-full shadow-2xl border-2 border-green-200 bg-white">
          <CardContent className="p-8 md:p-12 text-center space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-teal-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Main Message */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-green-950">
                תודה רבה!
              </h1>
              <p className="text-xl md:text-2xl text-green-800 font-semibold">
                הבקשה שלך נשלחה בהצלחה
              </p>
            </div>

            {/* Details */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-3">
              <div className="flex items-center justify-center gap-2 text-green-900">
                <span className="text-2xl">⚡</span>
                <p className="text-lg font-semibold">
                  אנחנו על זה, אתם יכולים להמשיך כרגיל.
                </p>
              </div>
            </div>

            {/* What's Next */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-bold text-green-950">מה קורה עכשיו?</h3>
              <div className="grid md:grid-cols-3 gap-4 text-right">
                <div className="bg-white border border-green-100 rounded-lg p-4 space-y-2">
                  <div className="text-3xl font-bold text-green-600">1</div>
                  <p className="text-sm text-green-900 font-semibold">
                    קבלת טופס השלמת פרטים בווטאספ במידת הצורך
                  </p>
                </div>
                <div className="bg-white border border-green-100 rounded-lg p-4 space-y-2">
                  <div className="text-3xl font-bold text-green-600">2</div>
                  <p className="text-sm text-green-900 font-semibold">
                    אחרי התאמת מדביר לצורך, תקבלו הצעת מחיר ישירות לוואטספ
                  </p>
                </div>
                <div className="bg-white border border-green-100 rounded-lg p-4 space-y-2">
                  <div className="text-3xl font-bold text-green-600">3</div>
                  <p className="text-sm text-green-900 font-semibold">
                    סגרנו, המדביר בדרך אליכם
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <Button
                size="lg"
                onClick={() => setLocation("/")}
                variant="outline"
                className="text-green-700 border-green-300 hover:bg-green-50"
              >
                חזרה לדף הבית
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
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

