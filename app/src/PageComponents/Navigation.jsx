import { Link } from "react-router-dom";
import cfpLogoDarkScreenNav from '../images/cfpLogoDarkScreenNav.png';
import cfpLogoDarkScreenNavLines from '../images/cfpLogoDarkScreenNavLines.png';

// import Home from '../Pages/Home';
// import Deploy from '../Pages/Deploy';
// import JoinPool from '../Pages/JoinPool';
// import PoolManagement from '../Pages/PoolManagement';
// import Standings from '../Pages/Standings';


function NavBar() {
    const { rankings } = location.state || {};
    return (
        <>
            <div className="head">
                <div className='homeTitleContainer'>
                    <div className='homeTitleTopLine'>
                        <nav className='navbar'>
                            <Link to='/' className='homeNav'>
                                <img src={cfpLogoDarkScreenNavLines} alt='Home' className='cfpHomeButton' />
                                <div className='backText'>Home</div>
                            </Link>
                        </nav>
                        <div className='homeNavTitle'>College Football Playoff</div>
                        <div></div>
                    </div>
                    <div className='homeNavTitle'>Pool Manager</div>
                </div>
            </div>
        </>
    )
}

export default NavBar