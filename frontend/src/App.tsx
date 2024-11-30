import { useEffect, useState } from "react";
import {
  RouterProvider,
  ScrollRestoration,
  createBrowserRouter,
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Modal, ModalProvider } from "./context/Modal";
import Navigation from "./components/Navigation";
import Homepage from "./components/Homepage";
import { restoreUserThunk } from "./store/slices/sessionSlice";
import { useAppDispatch } from "./store";
import Footer from "./components/Footer";
import MyPostsPage from "./components/MyPostsPage";
import CreatePostForm from "./components/CreatePostForm";

function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="error-container">
        <h1>You are on an untravelled path! {error.status}</h1>
        <p>{error.statusText}</p>
        <button onClick={() => window.history.back()} className="back-button">
          Return to the trail
        </button>
      </div>
    );
  }

  return (
    <div className="error-container">
      <h1>Oops!</h1>
      <p>Something went wrong</p>
      <button onClick={() => window.history.back()} className="back-button">
        Go Back
      </button>
    </div>
  );
}

function Layout() {
  const dispatch = useAppDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(restoreUserThunk()).finally(() => setIsLoaded(true));
  }, [dispatch]);

  if (!isLoaded) {
    return null;
  }

  return (
    <ModalProvider>
      <ScrollRestoration />
      <header>
        <Navigation />
      </header>
      <main className="main-content">
        <Outlet />{" "}
      </main>
      <Footer />
      <Modal />
    </ModalProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <Homepage />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/home",
        element: <Homepage />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/my-posts",
        element: <MyPostsPage />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/posts/new",
        element: <CreatePostForm />,
        errorElement: <ErrorBoundary />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
