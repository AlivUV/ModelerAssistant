import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  let navigate = useNavigate();
  const logout = (event) => {
    event.preventDefault()
    sessionStorage.clear()
    navigate("/login")
  }
  return (
    <span onClick={logout} style={{ cursor: 'pointer' }}>
      <i className="bi bi-box-arrow-right text-white fs-4"></i>
    </span>
  );
};

export default LogoutButton;