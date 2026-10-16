export default function AccountPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          My Account
        </h1>

        <p className="mt-3 text-gray-600">
          Account functionality will be connected to Django authentication.
        </p>
      </div>
    </main>
  );
}