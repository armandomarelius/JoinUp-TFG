import { AuthProvider } from "./context/AuthContext";
import { FavoriteProvider } from "./context/FavoriteContext";
import { RouterProvider } from "react-router-dom";
import router from "./router"
import { NotificationProvider } from './context/NotificationContext';

function App() {

  return (
    <>
     <AuthProvider> 
      <NotificationProvider>
        <FavoriteProvider>
          <RouterProvider router={router} />
        </FavoriteProvider>
      </NotificationProvider>
    </AuthProvider>
    </>
  )
}

export default App
