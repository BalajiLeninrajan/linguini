import Header from "~/app/_components/header"; // Add this at the top of the file
import { api } from "~/trpc/server";
import { redirect } from "next/navigation"; // Add this at the top of the file

export default async function Home() {
  const currentUser = await api.auth.currentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FFF1D4]">
      <Header />
    </div>
  );
}
