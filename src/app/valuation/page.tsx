import ValuationClient from "./ValuationClient";
import { Freshness } from "@/components/Freshness";
import { editorialIso } from "@/lib/seo/editorial";

// غلاف خادم لصفحة التقييم (النموذج مكوّن عميل): يمرر «آخر مراجعة» بنفس dateModified في JSON-LD (valuation/layout.tsx)
export default function ValuationPage() {
  return (
    <ValuationClient
      freshnessSlot={
        <Freshness
          data={editorialIso("/valuation/", "modified")}
          dataLabel="آخر مراجعة لهذه الصفحة"
          className="freshness text-sm text-gray-300 mt-3"
        />
      }
    />
  );
}
