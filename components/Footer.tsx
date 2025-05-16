// app/components/Footer.tsx

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-10 py-6 text-sm text-gray-500">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p>&copy; {new Date().getFullYear()} Penjualin. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-indigo-600 transition">
            Tentang
          </a>
          <a href="#" className="hover:text-indigo-600 transition">
            Kontak
          </a>
          <a href="#" className="hover:text-indigo-600 transition">
            Kebijakan Privasi
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
