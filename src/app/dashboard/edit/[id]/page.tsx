import EditPropertyClient from "./EditPropertyClient";

export function generateStaticParams() {
  return Array.from({ length: 100 }, (_, i) => ({
    id: `prop-${String(i + 1).padStart(3, "0")}`,
  }));
}

export default function EditPropertyPage() {
  return <EditPropertyClient />;
}
