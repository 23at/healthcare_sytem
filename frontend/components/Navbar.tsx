import Link from "next/link";

const Navbar = () => {
  // In real scenario, check user role here
  //   const userRole = "Doctor"; // or 'Admin'

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <Link href="/">
        <h1 className="font-bold">Healthcare App</h1>
      </Link>

      <div className="space-x-4">
        <Link href="/patients">Patients</Link>
        <Link href="/visits">Visits</Link>
        {/* {userRole === "Admin" && ( */}
        <Link href="/prescriptions">Prescriptions</Link>
        {/* )} */}
      </div>
    </nav>
  );
};

export default Navbar;
