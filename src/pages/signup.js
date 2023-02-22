import React from 'react';
import { useNavigate} from 'react-router-dom';
const SignUp = () => {
  const navigate = useNavigate();

  return (
    <>
    <div className="container">
    <div id="header">
      <h2>TCAP Dashboard</h2>
    </div>
    <p>This portal was developed under the Tuvalu Coastal Adaption Project (TCAP). The dashboard provides home for gridded and geospatial data produced by the project. </p>

    <pre><code className="javascript" id="code"></code></pre>
   
    <div className="row" >
    <div className="col-sm-3">

    <div class="card" style={{width: "100%"}}>

  <img src={require('../images/inund.png')} class="card-img-top" alt="Loading.."style={{height:'160px'}}/>
  <div class="card-body">
    <h5 class="card-title">Inundation</h5>
    <p class="card-text" style={{fontSize:'13px'}}>Shows inundation for different climate projections.</p>

    <button type="button" className="btn btn-primary" onClick={()=>{ navigate('/tcap/inundation')}}>Browse {">"}</button>
  </div>
</div>
</div>
<div className="col-sm-3">

<div class="card" style={{width: "100%"}}>

<img src={require('../images/shore.png')} class="card-img-top" alt="Loading.."style={{height:'160px'}}/>
<div class="card-body">
<h5 class="card-title">Shoreline Change</h5>

<p class="card-text" style={{fontSize:'13px'}}>Tool for doing shoreline change analysis.</p>

<button type="button" className="btn btn-primary" onClick={()=>{ navigate('/tcap/shoreline')}}>Browse {">"}</button>
</div>
</div>
</div>
<div className="col-sm-3">

<div class="card" style={{width: "100%"}}>

<img src={require('../images/risk.png')} class="card-img-top" alt="Loading.." style={{height:'160px'}}/>
<div class="card-body">
<h5 class="card-title">Risks</h5>

<p class="card-text" style={{fontSize:'13px'}}>Shows risk level on different assets.</p>

<button type="button" className="btn btn-primary" onClick={()=>{ navigate('/tcap/risk')}}>Browse {">"}</button>
</div>
</div>
</div>
<div className="col-sm-3">

    <div class="card" style={{width: "100%"}}>

  <img src={require('../images/report.png')} class="card-img-top" alt="Loading.." style={{height:'160px'}}/>
  <div class="card-body">
    <h5 class="card-title">Catalogue</h5>

    <p class="card-text" style={{fontSize:'13px'}}>A collection of reports produced.</p>

    <button type="button" className="btn btn-primary" onClick={()=>{ navigate('/tcap/reports')}}>Browse {">"}</button>
  </div>
</div>
</div>

</div>
<pre><code className="javascript" id="code"></code></pre>
<pre><code className="javascript" id="code"></code></pre>
<pre><code className="javascript" id="code"></code></pre>
<p style={{textAlign: 'center', fontWeight:'bold', color:'#979797'}}>
  Developed and Funded by:
  <div className="row" >
    <div className="col-sm-12" >

    <img src={require('../images/spc1.svg')} class="card-img-top" alt="Loading.." style={{height:'80px', width:'100px', paddingRight:"8px"}}/>
    <img src={require('../images/tv.png')} class="card-img-top" alt="Loading.." style={{height:'50px', width:'50px', paddingRight:"8px"}}/>
     
    <img src={require('../images/undp2.png')} class="card-img-top" alt="Loading.."style={{height:'46px', width:'40px', paddingRight:"8px"}}/>
    <img src={require('../images/tcap.png')} class="card-img-top" alt="Loading.."style={{height:'46px', width:'50px', paddingRight:"8px"}}/>
    <img src={require('../images/logo_GCF2.png')} class="card-img-top" alt="Loading.."style={{height:'46px', width:'90px', paddingRight:"8px"}}/>
   
     </div>
      </div>
</p>

</div>
</>
  );

};

export default SignUp;
