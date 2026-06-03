import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { getAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Controller | Annapurna Equipments",
};

export default async function CmsLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/cms/");
  }
  const email = process.env.MASTER_USER_EMAIL ?? process.env.ADMIN_EMAIL ?? "admin@annapurna.local";
  const password = process.env.MASTER_USER_PASSWORD ?? process.env.ADMIN_PASSWORD ?? "ChangeMe#2026";

  return (
    <section className="hero-grid min-h-[80vh] px-4 py-20 sm:px-6 lg:px-8">
      <AdminLoginForm />
      <div className="mx-auto mt-5 w-full max-w-md rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-6 text-amber-900">
        <p className="font-bold">Configured login credentials</p>
        <p>Email: {email}</p>
        <p>Password: {password}</p>
      </div>
    </section>
  );
}
