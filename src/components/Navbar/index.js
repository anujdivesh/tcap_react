import React from 'react';
import {
  Nav,
  NavLink,
  NavMenu,
  NavLinkage
} from './NavbarElements';

const Navbar = () => {
  return (
    <>
      <Nav>

      <NavLinkage to='/tcap'>
          <img src={require('../../images/spx.png')} alt='logo' style={{width:"85px", height:"50px"}}/>
        </NavLinkage>

      <NavLinkage to='/tcap' >
          <img src={require('../../images/tv.png')} alt='logo' style={{width:"50px", height:"50px",marginTop:"-2px"}}/>
        </NavLinkage>
      <NavLinkage to='/tcap'>
          <img src={require('../../images/undp2.png')} alt='logo' style={{width:"30px", height:"45px"}}/>
        </NavLinkage>
      <NavLinkage to='/tcap' >
          <img src={require('../../images/tcap.png')} alt='logo' style={{width:"50px", height:"50px", marginTop:"-3px"}}/>
        </NavLinkage>
        
      <NavLinkage to='/tcap' >
          <img src={require('../../images/logo_GCF2.png')} alt='logo' style={{width:"70px", height:"45px"}}/>
        </NavLinkage>
        <NavLink to='/tcap' style={{color:"white", fontWeight:"bold", fontSize:"18px", paddingLeft:'15%'}}>
        Tuvalu Coastal Adaptation Project
        </NavLink>
        <NavMenu style={{paddingLeft:'10%'}}>
        <NavLink to='/tcap/home'>
          Home
          </NavLink>
          <NavLink to='/tcap/inundation'>
            Inundation
          </NavLink>
          <NavLink to='/tcap/shoreline'>
            Shoreline
          </NavLink>
          <NavLink to='/tcap/risk'>
            Risks
          </NavLink>
          <NavLink to='/tcap/reports'>
          Catalogue
          </NavLink>
          
        </NavMenu>
      </Nav>
    </>
  );
};

export default Navbar;
