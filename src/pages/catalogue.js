import React, { useEffect, useRef } from 'react';
const Catalogue = () => {

  const _isMounted = useRef(true);

   useEffect(() => {  
     
   if (_isMounted.current){
     
   }  
   return () => { _isMounted.current = false }; 
   },[]);
   

  return (
    <>
    <div className="container">
    <div className="row" >
    <div className="col-sm-3">

    <div class="card" style={{width: "100%"}}>

  <img src={require('../images/ocean22.jpg')} class="card-img-top" alt="Loading.."/>
  <div class="card-body">
    <h5 class="card-title">Risk profile</h5>
    <p class="card-text">Risk profile for Nanumaga</p>

    <button type="button" className="btn btn-primary">Browse</button>
  </div>
</div>
</div>
<div className="col-sm-3">

    <div class="card" style={{width: "100%"}}>

  <img src={require('../images/ocean22.jpg')} class="card-img-top" alt="Loading.."/>
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the car</p>

    <button type="button" className="btn btn-primary">Browse</button>
  </div>
</div>
</div>

</div>
</div>
</>
  );

};

export default Catalogue;
