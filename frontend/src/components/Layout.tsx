import { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FaBuilding, FaUserShield } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, admin, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-1 md:gap-2 text-xl md:text-2xl font-bold">
              <FaBuilding />
              <span>BizLocate</span>
            </Link>
            <nav>
              <ul className="flex gap-2 md:gap-4 items-center">
                <li>
                  <Link 
                    href={isAuthenticated ? "/admin" : "/admin/login"} 
                    className="btn btn-secondary btn-sm flex items-center gap-1"
                  >
                    <FaUserShield className="text-sm md:text-base" />
                    <span className="text-sm md:text-base">Admin</span>
                  </Link>
                </li>
                {isAuthenticated && (
                  <li>
                    <button 
                      onClick={logout} 
                      className="btn btn-ghost btn-sm text-sm md:text-base"
                    >
                      Logout
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow px-0">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">BizLocate</h3>
              <p className="text-sm md:text-base">Find and connect with trusted local businesses in your area.</p>
            </div>
            <div className="text-center md:text-right">
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Contact Us</h3>
              <p className="text-sm md:text-base mb-1 md:mb-2">1234 Business Ave</p>
              <p className="text-sm md:text-base mb-1 md:mb-2">City, State 12345</p>
              <p className="text-sm md:text-base mb-1 md:mb-2">info@bizlocate.com</p>
              <p className="text-sm md:text-base">(123) 456-7890</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 md:mt-8 pt-4 md:pt-6 text-center">
            <p className="text-sm md:text-base">&copy; {new Date().getFullYear()} BizLocate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 