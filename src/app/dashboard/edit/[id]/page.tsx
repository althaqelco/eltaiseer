import EditPropertyClient from "./EditPropertyClient";

// Force dynamic rendering to support Firestore-generated IDs
export const dynamic = 'force-dynamic';

export default function EditPropertyPage() {
  return <EditPropertyClient />;
}
