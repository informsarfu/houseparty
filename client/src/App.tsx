import { LoginSignup } from "./component/LoginSignup/LoginSignup";
import { MyRooms } from "./component/MyRooms/MyRooms";
import { Home } from "./component/Home/Home";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/my-rooms" element={<MyRooms />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;