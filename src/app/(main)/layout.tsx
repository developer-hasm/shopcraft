import { Header } from "@/components/header";
import type { HeaderUser } from "@/components/header";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { USER_METADATA_DISPLAY_NAME } from "@/config/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const headerUser: HeaderUser | null = user
    ? {
        email: user.email ?? "",
        displayName:
          (user.user_metadata?.[USER_METADATA_DISPLAY_NAME] as string) ?? "",
      }
    : null;

  return (
    <>
      <Header user={headerUser} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
