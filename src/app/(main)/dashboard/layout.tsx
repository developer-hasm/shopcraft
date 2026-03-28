import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LOGIN_PATH } from "@/config/auth";
import { Container } from "@/components/container";
import { DashboardNav } from "@/components/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(LOGIN_PATH);
  }

  return (
    <Container className="py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full md:w-56 shrink-0">
          <DashboardNav />
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </Container>
  );
}
