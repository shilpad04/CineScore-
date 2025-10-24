function Footer() {
  return (
    <footer className="mt-12 bg-[#1f1f1f] border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-neutral-300 text-center">
        
        {/* Left: Brand */}
        <div className="flex justify-center items-center">
          <div className="text-[#f5c518] font-black text-2xl">CineScore</div>
        </div>

        {/* Middle: Links */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="font-semibold mb-2 underline underline-offset-4">Links</div>
          <ul className="space-y-1">
            <li>
              <a
                className="hover:text-[#f5c518] transition-colors"
                href="#"
              >
                About
              </a>
            </li>
            <li>
              <a
                className="hover:text-[#f5c518] transition-colors"
                href="#"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                className="hover:text-[#f5c518] transition-colors"
                href="#"
              >
                Privacy
              </a>
            </li>
          </ul>
        </div>

        {/* Right: © */}
        <div className="flex justify-center items-center">
          <div className="text-neutral-400">© All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
