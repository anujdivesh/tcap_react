import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import "leaflet-side-by-side";
import "./L.TileLayer.BetterWMS";
import {mayFlyer, addLayer,addShorelineImagenoPaneGen} from "./helper";

const About = () => {

  //VARIABLES
  const [display, setDisplay] = useState(false);
  const displayRef = useRef(false);
  const layer = useRef();
  const shorelineLayer = useRef();
  const baseLayer = useRef();
  const layer2 = useRef();
  const sidebyside = useRef();
  const _isMounted = useRef(true);
  const mapContainer = React.useRef(null);
  const [checked, setChecked] = React.useState(false);
 // const url = "http://149.28.173.12/thredds/wms/Oceans/TCAP/final/";

  const url = "https://tds-test.pacificdata.org/thredds/wms/Oceans/TCAP/final/"
  const yearRef = useRef(5);
  const yearRef2 = useRef(5);
  const siteRef = useRef("Nanumaga");
  const siteRef2 = useRef("Nanumaga");
  const horizonRef = useRef("2060");
  const horizonRef2 = useRef("2060");
  const climateRef = useRef("SSP2");
  const climateRef2 = useRef("SSP2");
  const presentBoolRef = useRef(true);
  const presentBoolRef2 = useRef(false);
  const legendColorRef = useRef();
  const pointerRef = useRef(1);
  const [ value, setValue ] = React.useState(pointerRef.current);
  //const [pointer, setPointer] = useState(pointerRef.current);
  
  function initMap(url){
 /*
    const BING_KEY = 'AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L'
   
    baseLayer.current = L.tileLayer.bing(BING_KEY, {
      maxZoom: 5,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

*/
    baseLayer.current = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; Pacific Community (OSM)',
      detectRetina: true
  });

  
  mapContainer.current = L.map('map', {
    zoom: 7,
    center: [-6.287321, 176.320346]
  });
  baseLayer.current.addTo(mapContainer.current); 
  //shorelineLayer.current = addShorelineImagenoPane(mapContainer.current, siteRef.current, "2021")
  shorelineLayer.current = addShorelineImagenoPaneGen(mapContainer.current, siteRef.current)

  layer.current = addLayer(mapContainer.current, url, siteRef.current, yearRef.current,horizonRef.current,climateRef.current,presentBoolRef.current,pointerRef.current)
  mayFlyer(mapContainer.current, siteRef.current);
  
  //LEGENDD
  
  legendColorRef.current = L.control({ position: "topright", id:12 });
  legendColorRef.current.onAdd = function() {
          var div = L.DomUtil.create("div", "legend");
          div.innerHTML += "<h4>Legend</h4>";
          div.innerHTML += '<img src="https://tds-test.pacificdata.org/thredds/wms/Oceans/TCAP/FinalDS/Present/Nanumaga_out10-yearARI.nc?version=1.3.0&request=GetLegendGraphic&LAYERS=Depth&STYLES=default-scalar/div-Spectral-inv&numcolorbands=250&transparent=TRUE&width=50&height=200&colorscalerange=0,2" alt="Legend">';
         return div;
        };
        legendColorRef.current.addTo(mapContainer.current);
  //Popup
  mapContainer.current.on('popupopen', function (e) {
  if(displayRef.current){
    mapContainer.current.closePopup();
  }
  
  });
  }
useEffect(() => {  
  
if (_isMounted.current){
  initMap(url);
  
}  
return () => { _isMounted.current = false }; 
},[]);


const handleYear=(e)=>{
  yearRef.current = e.target.value;

  mapContainer.current.removeLayer(layer.current);
 
  if (e.target.value === "MHWS"){
    layer.current = addLayer(mapContainer.current, url, siteRef.current, yearRef.current,horizonRef.current,climateRef.current,presentBoolRef.current,pointerRef.current)
 // mayFlyer(mapContainer.current, siteRef.current);

  if(checked === true){
    mapContainer.current.removeControl(sidebyside.current);
    mapContainer.current.removeLayer(layer2.current);
    layer2.current = addLayer(mapContainer.current, url, siteRef2.current, yearRef2.current,horizonRef2.current,climateRef2.current,presentBoolRef.current,pointerRef.current)
    sidebyside.current = L.control.sideBySide(layer.current, layer2.current).addTo(mapContainer.current);
   }
 }
 else{
  layer.current = addLayer(mapContainer.current, url, siteRef.current, yearRef.current,horizonRef.current,climateRef.current,presentBoolRef.current,pointerRef.current)
//  mayFlyer(mapContainer.current, siteRef.current);

  if(checked === true){
    mapContainer.current.removeControl(sidebyside.current);
    mapContainer.current.removeLayer(layer2.current);
    layer2.current = addLayer(mapContainer.current, url, siteRef2.current, yearRef2.current,horizonRef2.current,climateRef2.current,presentBoolRef.current,pointerRef.current)
    sidebyside.current = L.control.sideBySide(layer.current, layer2.current).addTo(mapContainer.current);
   }
  }
}

const handleYear2=(e)=>{
   yearRef2.current = e.target.value;
   mapContainer.current.removeControl(sidebyside.current);
   mapContainer.current.removeLayer(layer2.current);
   if (e.target.value === "MHWS"){
    layer2.current = addLayer(mapContainer.current, url, siteRef2.current, yearRef2.current,horizonRef2.current,climateRef2.current,presentBoolRef2.current,pointerRef.current);
    sidebyside.current = L.control.sideBySide(layer.current, layer2.current).addTo(mapContainer.current);
  //  mayFlyer(mapContainer.current, siteRef.current);
   }
   else{
  
   layer2.current = addLayer(mapContainer.current, url, siteRef2.current, yearRef2.current,horizonRef2.current,climateRef2.current,presentBoolRef2.current,pointerRef.current);
   sidebyside.current = L.control.sideBySide(layer.current, layer2.current).addTo(mapContainer.current);
 //  mayFlyer(mapContainer.current, siteRef.current);
   }
 }
/*
 const handleSite2=(e)=>{
  siteRef2.current = e.target.value;
  mapContainer.current.removeControl(sidebyside.current);
  mapContainer.current.removeLayer(layer2.current);
  layer2.current = addLayer(mapContainer.current, url, siteRef2.current, yearRef2.current,horizonRef2.current,climateRef2.current,presentBoolRef.current,pointerRef.current);
  sidebyside.current = L.control.sideBySide(layer.current, layer2.current).addTo(mapContainer.current);
  mayFlyer(mapContainer.current, siteRef.current);
}

*/
const handleSite=(e)=>{
  siteRef.current = e.target.value;
  siteRef2.current = e.target.value;
  mapContainer.current.removeLayer(layer.current);
  mapContainer.current.removeLayer(shorelineLayer.current);
  shorelineLayer.current = addShorelineImagenoPaneGen(mapContainer.current, siteRef.current)
  console.log(siteRef.current)
  layer.current = addLayer(mapContainer.current, url, siteRef.current, yearRef.current,horizonRef.current,climateRef.current,presentBoolRef.current,pointerRef.current)
 
  mayFlyer(mapContainer.current, siteRef.current);
  if(checked === true){
    mapContainer.current.removeControl(sidebyside.current);
    mapContainer.current.removeLayer(layer2.current);
    layer2.current = addLayer(mapContainer.current, url, siteRef2.current, yearRef2.current,horizonRef2.current,climateRef2.current,presentBoolRef.current,pointerRef.current)
    sidebyside.current = L.control.sideBySide(layer.current, layer2.current).addTo(mapContainer.current);
   }
}
const handleClick = (e) => {
  //Show layer
  setDisplay(!display)
  setChecked(!checked)

  mapContainer.current.closePopup();
  displayRef.current = !display;

  if(checked === false){
    var curr_layer_url = layer.current._url;
    var split_url = curr_layer_url.split("/");
    var split_nc = split_url[7].split(".");
    console.log(split_nc[0])

    layer2.current = addLayer(mapContainer.current, url, siteRef2.current, yearRef2.current,horizonRef.current,climateRef.current,presentBoolRef.current,pointerRef.current)

    sidebyside.current = L.control.sideBySide(layer.current, layer2.current).addTo(mapContainer.current);
  }
  else{
    mapContainer.current.removeControl(sidebyside.current);
    mapContainer.current.removeLayer(layer2.current);
  }
  e.currentTarget.blur();
}


const [gender, setGender] = useState("SSP2");

  function onChangeValue(e) {
    setGender(e.target.value);
    climateRef.current = e.target.value
      presentBoolRef.current = false;
  mapContainer.current.removeLayer(layer.current);
  layer.current = addLayer(mapContainer.current, url, siteRef.current, yearRef.current,horizonRef.current,climateRef.current,presentBoolRef.current,pointerRef.current)
  //mayFlyer(mapContainer.current, siteRef.current);

  if(checked === true){
    mapContainer.current.removeControl(sidebyside.current);
    mapContainer.current.removeLayer(layer2.current);
    layer2.current = addLayer(mapContainer.current, url, siteRef2.current, yearRef2.current,horizonRef2.current,climateRef2.current,presentBoolRef.current,pointerRef.current)
    sidebyside.current = L.control.sideBySide(layer.current, layer2.current).addTo(mapContainer.current);
   }
   e.currentTarget.blur();
  }

  const [gender2, setGender2] = useState("SSP2");

  function onChangeValue2(e) {
    setGender2(e.target.value);
    console.log(e.target.value);
    climateRef2.current = e.target.value
    presentBoolRef2.current = false;
   mapContainer.current.removeControl(sidebyside.current);
   mapContainer.current.removeLayer(layer2.current);
   layer2.current = addLayer(mapContainer.current, url, siteRef2.current, yearRef2.current,horizonRef2.current,climateRef2.current,presentBoolRef.current,pointerRef.current);
   sidebyside.current = L.control.sideBySide(layer.current, layer2.current).addTo(mapContainer.current);
 //  mayFlyer(mapContainer.current, siteRef.current);
   e.currentTarget.blur();
  }
  const [horizon, setHorizon] = useState("present");

  function onChangeValueHorizon(e) {
    setHorizon(e.target.value);
    horizonRef.current = e.target.value
    console.log(horizonRef.current);

    if (e.target.value !== "present"){
      presentBoolRef.current = false;
   // yearRef.current = e.target.value;
  mapContainer.current.removeLayer(layer.current);
  layer.current = addLayer(mapContainer.current, url, siteRef.current, yearRef.current,horizonRef.current,climateRef.current,presentBoolRef.current,pointerRef.current)
 // mayFlyer(mapContainer.current, siteRef.current);

  if(checked === true){
    mapContainer.current.removeControl(sidebyside.current);
    mapContainer.current.removeLayer(layer2.current);
    layer2.current = addLayer(mapContainer.current, url, siteRef2.current, yearRef2.current,horizonRef2.current,climateRef2.current,presentBoolRef.current,pointerRef.current)
    sidebyside.current = L.control.sideBySide(layer.current, layer2.current).addTo(mapContainer.current);
   }
  }
  else{
   // setHorizon2('present')
    presentBoolRef.current = true;
    mapContainer.current.removeLayer(layer.current);
    layer.current = addLayer(mapContainer.current, url, siteRef.current, yearRef.current,horizonRef.current,climateRef.current,presentBoolRef.current,pointerRef.current)
  // mayFlyer(mapContainer.current, siteRef.current);
  
    if(checked === true){
      mapContainer.current.removeControl(sidebyside.current);
      mapContainer.current.removeLayer(layer2.current);
      layer2.current = addLayer(mapContainer.current, url, siteRef2.current, yearRef2.current,horizonRef2.current,climateRef2.current,presentBoolRef.current,pointerRef.current)
      sidebyside.current = L.control.sideBySide(layer.current, layer2.current).addTo(mapContainer.current);
     }
  }
   e.currentTarget.blur();
  }

  const [horizon2, setHorizon2] = useState("2060");

  function onChangeValueHorizon2(e) {

    if (e.target.value !== "present"){
      presentBoolRef2.current = false;
    setHorizon2(e.target.value);
    horizonRef2.current = e.target.value
  
   mapContainer.current.removeControl(sidebyside.current);
   mapContainer.current.removeLayer(layer2.current);
   layer2.current = addLayer(mapContainer.current, url, siteRef2.current, yearRef2.current,horizonRef2.current,climateRef2.current,presentBoolRef2.current,pointerRef.current);
   sidebyside.current = L.control.sideBySide(layer.current, layer2.current).addTo(mapContainer.current);
 //  mayFlyer(mapContainer.current, siteRef.current);
    }
    else{
      presentBoolRef2.current = true;
    setHorizon2(e.target.value);
    horizonRef2.current = e.target.value
  
   mapContainer.current.removeControl(sidebyside.current);
   mapContainer.current.removeLayer(layer2.current);
   layer2.current = addLayer(mapContainer.current, url, siteRef2.current, yearRef2.current,horizonRef2.current,climateRef2.current,presentBoolRef2.current,pointerRef.current);
   sidebyside.current = L.control.sideBySide(layer.current, layer2.current).addTo(mapContainer.current);
 //  mayFlyer(mapContainer.current, siteRef.current);
    }
   e.currentTarget.blur();
  }


  const slider = (e) => {
    e.currentTarget.blur();
    setValue(e.target.value)
    //setPointer(e.target.value)
    pointerRef.current = e.target.value;
    console.log(e.target.value)
    mapContainer.current.removeLayer(layer.current);
    layer.current = addLayer(mapContainer.current, url, siteRef.current, yearRef.current,horizonRef.current,climateRef.current,presentBoolRef.current,e.target.value);
    e.currentTarget.blur();
  }

  return (
    <div className="container-fluid">
    <div className="row" style={{height:"93.5vh"}}>
    <div className="col-sm-2"  style={{backgroundColor:"#efefef",padding:0}}>
    <div className="card">
    <div className="card-body" style={{fontSize:"13px"}}>
   
      <div className="row" style={{marginTop:'-10px'}}>
    <div className="col-sm-6">

    <p>Sites:</p>
      </div>
      <div className="col-sm-6">
      <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleSite} style={{fontSize:'13px', paddingLeft:1}}>
  <option value="Nanumaga">Nanumaga</option>
  <option value="Nanumea">Nanumea</option>
  <option value="Funafuti">Funafuti</option>
  <option value="Niulakita">Niulakita</option>
  <option value="Niutao">Niutao</option>
  <option value="Nui">Nui</option>
  <option value="Nukufetau">Nukufetau</option>
  <option value="Nukulaelae">Nukulaelae</option>
  <option value="Vaitupu">Vaitupu</option>
</select>
      </div>
      </div>
      <hr style={{marginTop:0}}/>

    <div className="row"style={{marginTop:'-10px'}}>
    <div className="col-sm-6">

    <p>Return Period:</p>
      </div>

      <div className="col-sm-6">
      <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleYear} id="Year1" name="Year1" style={{fontSize:'13px', paddingLeft:1}}>
  <option value="5">5 Year</option>
  <option value="10">10 Year</option>
  <option value="25">25 Year</option>
  <option value="50">50 Year</option>
  <option value="100">100 Year</option>
  <option value="250">250 Year</option>
  <option value="MHWS">MHWS - No Waves</option>
</select>

</div>

      </div>

      <hr style={{marginTop:0}}/>
      <div className="row" style={{marginTop:'-10px'}}>
    <div className="col-sm-6">

    <p>Climate Period:</p>
      </div>
      <div className="col-sm-6">

      <div className="form-check">
                  <input type="radio" className="form-check-input" value="present" id="present"
               name="horizon" onChange={onChangeValueHorizon} checked={horizon === "present"}/>
             <label>Present Climate </label>
             </div>
      <div className="form-check">
                  <input type="radio" className="form-check-input" value="2060" id="2060"
                name="horizon" onChange={onChangeValueHorizon} checked={horizon === "2060"}/>
             <label>2060</label>
             </div>
             <div className="form-check">
                  <input type="radio" className="form-check-input" value="2100" id="2100"
                name="horizon" onChange={onChangeValueHorizon} checked={horizon === "2100"} />
             <label>2100</label>
             </div>
      </div>
      </div>
      <hr style={{marginTop:0}}/>
      <div className="row" style={{marginTop:'-10px'}}>
    <div className="col-sm-6">

    <p>Climate Change Scenario:</p>
      </div>
      <div className="col-sm-6">
      <div className="form-check">
                  <input type="radio" className="form-check-input" value="SSP2" id="SSP2"
                name="gender" onChange={onChangeValue} checked={gender === "SSP2"} disabled={presentBoolRef.current }/>
             <label>SSP2 4.5</label>
             </div>
             <div className="form-check">
                  <input type="radio" className="form-check-input" value="SSP5" id="SSP5"
               name="gender" onChange={onChangeValue} checked={gender === "SSP5"} disabled={presentBoolRef.current}/>
             <label>SSP5 8.5</label>
             </div>
      </div>
      </div>
      <hr style={{marginTop:0}}/>
      <div className="row" style={{marginBottom:'-15px',marginTop:'-10px'}}>
      <div className="col-sm-4">
<p>Opacity:</p> </div>
    <div className="col-sm-5">
    <input type="range" className="form-range" min={0} max={1} step={0.1} id="refreshButton" value={value} onChange={slider} style={{height:'10px'}}/>
      </div>
      <div className="col-sm-3">
       <p>{pointerRef.current*100}%</p>
      </div>
      </div>
     

    
    
    </div>
  </div>


  <div className="form-check" style={{marginLeft:"20px", fontSize:"13px"}}>
  <input className="form-check-input" type="checkbox" id="fj_ezz" name="fj_ezz" onChange={handleClick} defaultChecked={checked} />
  <label className="form-check-label">Activate Compare Layer</label>
</div> 

{display ?
 <div className="card">
 <div className="card-body" style={{fontSize:"13px"}}>
 <div className="row">
 <div className="col-sm-6">

 <p>Return Period:</p>
   </div>
   <div className="col-sm-6">
    <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleYear2} style={{fontSize:'13px', paddingLeft:1}}>
    <option value="5">5 Year</option>
    <option value="10">10 Year</option>
    <option value="25">25 Year</option>
    <option value="50">50 Year</option>
    <option value="100">100 Year</option>
    <option value="250">250 Year</option>
    <option value="MHWS">MHWS - No Waves</option>
  </select>
   </div>
   </div>

   <hr style={{marginTop:0}}/>
   <div className="row" style={{marginTop:'-10px'}}>
    <div className="col-sm-6">

    <p>Climate Period:</p>
      </div>
      <div className="col-sm-6">

      <div className="form-check">
                  <input type="radio" className="form-check-input" value="present" id="present"
               name="horizon2" onChange={onChangeValueHorizon2} checked={horizon2 === "present"} />
             <label>Present Climate</label>
             </div>
      <div className="form-check">
                  <input type="radio" className="form-check-input" value="2060" id="2060"
                name="horizon2" onChange={onChangeValueHorizon2} checked={horizon2 === "2060"}/>
             <label>2060</label>
             </div>
             <div className="form-check">
                  <input type="radio" className="form-check-input" value="2100" id="2100"
                name="horizon2" onChange={onChangeValueHorizon2} checked={horizon2 === "2100"}/>
             <label>2100</label>
             </div>
      </div>
      </div>
      <hr style={{marginTop:0}}/>
      <div className="row" style={{marginTop:'-10px'}}>
    <div className="col-sm-6">

    <p>Climate Change Scenario:</p>
      </div>
      <div className="col-sm-6">
      <div className="form-check">
                  <input type="radio" className="form-check-input" value="SSP2" id="SSP2"
                name="gender2" onChange={onChangeValue2} checked={gender2 === "SSP2"} disabled={presentBoolRef2.current}/>
             <label>SSP2 4.5</label>
             </div>
             <div className="form-check">
                  <input type="radio" className="form-check-input" value="SSP5" id="SSP5"
               name="gender2" onChange={onChangeValue2} checked={gender2 === "SSP5"} disabled={presentBoolRef2.current}/>
             <label>SSP5 8.5</label>
             </div>
      </div>
      </div>
 
 </div>
</div>



: null}
      </div>
      <div className="col-sm-10" style={{padding:0}}>
      <div id="map" ref={mapContainer} style={{width:"100%", height:"100%",Zindex: "auto"}}></div>
      </div>
    </div>
  </div>

  )
}
export default About;
