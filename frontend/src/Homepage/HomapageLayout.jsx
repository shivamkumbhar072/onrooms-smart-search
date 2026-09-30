import { Outlet } from "react-router-dom";

function HomepageLayout() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main>
        <Outlet />
      </main>

    </div>
  );
}

export default HomepageLayout;