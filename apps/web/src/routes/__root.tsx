import { createRootRoute, Outlet, Link } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="p-4 bg-gray-100 border-b">
        <nav className="flex gap-4">
          <Link to="/" className="[&.active]:font-bold text-blue-600">
            Home
          </Link>
          <br/>
          <Link to="/about" className="[&.active]:font-bold text-blue-600">
            Sobre
          </Link>
          <br/>
          <Link to="/sign-in" className="[&.active]:font-bold text-blue-600">
            sign-in
          </Link>
          <br/>
          <Link to="/sign-up" className="[&.active]:font-bold text-blue-600">
            sign-up
          </Link>
          <br/>
          {/* <Link to="/tasks/37" className="[&.active]:font-bold text-blue-600">
            taskId
          </Link> */}
        </nav>
      </header>
      <br/><br/>
      <main className="p-4">
        <Outlet />
      </main>
      {/* <TanStackRouterDevtools initialIsOpen={true}/> */}
    </>
  ),
});