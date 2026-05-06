import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  return (
    <>
      <div className="aurora-bg"></div>
      <div className="flex min-h-screen text-gray-900">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
