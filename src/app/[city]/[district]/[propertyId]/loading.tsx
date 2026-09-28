// هيكل تحميل لصفحة العقار فقط (ديناميكية تُجلب من Firestore عند كل طلب) — يظهر فوراً عند الضغط على بطاقة عقار.
// لا تنقله للجذر ولا لأي مستوى أعلى: أي loading.tsx يبث الصفحة قبل تنفيذ notFound()/redirect() في الصفحات تحته،
// فتخرج 404 و308 بحالة 200 (noindex أو meta refresh). لهذا فحص المدينة في [city]/layout.tsx فوق هذه الحدود،
// وأي notFound()/redirect() يُضاف لصفحة العقار لن يُخرج حالة HTTP صحيحة — ضعه في layout فوقها.
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm">جاري التحميل...</p>
      </div>
    </div>
  );
}
