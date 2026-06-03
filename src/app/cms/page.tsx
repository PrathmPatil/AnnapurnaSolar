import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { getAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "CMS Controller | Annapurna Equipments",
};

export default async function CmsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/cms/login/");
  }

  return <AdminDashboard email={session.email} />;
}
