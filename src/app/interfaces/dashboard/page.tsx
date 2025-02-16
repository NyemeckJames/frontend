import DashboardLayout from "../layout";

export default function DashboardPage() {
  const userRole = "admin"; // ✅ Par défaut, admin

  return (
    <DashboardLayout userRole={userRole}>
      <h1 className="text-3xl font-bold">Bienvenue sur le Dashboard Admin</h1>
      <p>Accédez aux différentes fonctionnalités.</p>
    </DashboardLayout>
  );
}
