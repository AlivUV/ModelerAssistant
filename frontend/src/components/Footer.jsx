import { Link } from 'react-router-dom';
import { useState } from 'react';

const Footer = () => {
    const [date] = useState(new Date())

    return (
        <div>
            {/* Divider 2 */}
            <div className='bg-two'>
                <img className="w-100" src="/img/divider2.svg" alt="divider2" />
            </div>

            {/* Footer */}
            <div className="bg-one py-4">
                <div className="text-center mb-2">
                    <Link className="navbar-brand title text-white fs-32 fw-bold" to="/">SmartCopilot</Link>
                </div>

                <div className="d-flex justify-content-center mb-2">
                    <Link className="footer-link mx-3" to="/">Home</Link>
                    <Link className="footer-link mx-3" to="/projects">My Projects</Link>
                </div>

                <div className="text-center mb-2">
                    <p className="text-white">Developed by <strong className="text-white">Andrés García & Kevin Cifuentes</strong></p>
                </div>

                <div className="text-center">
                    <p className="text-white"><i className="bi bi-c-circle text-white"></i> Copyright {date.getFullYear()}</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;