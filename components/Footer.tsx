export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400">
            © {currentYear} SAELI
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a 
              href="/privacy" 
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              利用規約
            </a>
            <span className="text-gray-600">/</span>
            <a 
              href="/privacy" 
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              プライバシー
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
