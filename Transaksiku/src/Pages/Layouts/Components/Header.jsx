import Button from "@/Pages/Layouts/Components/Button";
import { confirmLogout } from "@/Utils/Helpers/SwalHelpers";

const Header = () => {
  const toggleProfileMenu = () => {
    const menu = document.getElementById("profileMenu");
    if (menu) menu.classList.toggle("hidden");
  };

  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">Transaksiku</h1>
        <Button
          size="md"
          variant="danger"
          onClick={() =>
            confirmLogout(() => {
              localStorage.removeItem("user");
              location.href = "/";
            })
          }
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
