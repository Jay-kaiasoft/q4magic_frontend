import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons';

import Loading from "./components/loading/loading";
import GlobalAlert from "./components/common/alert/globalAlert";
import Salesforce from "./salesforce";
import MuiThemeProvider from './components/common/muiTheme/muiTheme'

library.add(fas, far)

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Salesforce />,
    },
    {
      path: "*",
      element: <div className="h-screen">
        <div className="flex items-center justify-center h-full">
          <p className="font-extrabold text-3xl">
            Page not found
          </p>
        </div>
      </div>,
    },
  ])

  return (
    <>
      <MuiThemeProvider>
        <div className="h-screen">
          <Loading />
          <GlobalAlert />
          <RouterProvider router={router} />
        </div>
      </MuiThemeProvider>
    </>
  );
}

export default App;