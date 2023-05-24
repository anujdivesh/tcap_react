import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import "leaflet-side-by-side";
import "./L.TileLayer.BetterWMS";
import {mayFlyer, addLayer,addShorelineImagenoPaneGen, addTVMarker} from "./helper";
//import {SimpleMapScreenshoter} from 'leaflet-simple-map-screenshoter';
import { setGlobalState, useGlobalState } from './globalstate';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../components/data/config.json'

toast.configure()
const Dem = () => {

  //VARIABLES
  const displayRef = useRef(false);
  const layer = useRef(null);
  const shorelineLayer = useRef(null);
  const baseLayer = useRef();
  const layer3 = useRef(null);
  const _isMounted = useRef(true);
  const mapContainer = React.useRef(null);
 // const url = "http://149.28.173.12/thredds/wms/Oceans/TCAP/final/";

 const nameer = useGlobalState("island_name");
 const baseurl = config['thredds-address']
 const url = baseurl+"final/"
 // const url = "http://192.168.4.54:8080/thredds/wms/testAll/final/"
  const yearRef = useRef(5);
  const siteRef = useRef(nameer[0]);
  const siteRef2 = useRef(nameer[0]);
  const horizonRef = useRef("2060");
  const climateRef = useRef("SSP2");
  const presentBoolRef = useRef(true);
  const legendColorRef = useRef();

  const pointerRef = useRef(1);
  
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
    center: [-7.87321, 178.320346]
  });
  baseLayer.current.addTo(mapContainer.current); 
 // shorelineLayer.current = addShorelineImagenoPaneGen(mapContainer.current, siteRef.current)

  //layer.current = addLayer(mapContainer.current, url, siteRef.current, yearRef.current,horizonRef.current,climateRef.current,presentBoolRef.current,pointerRef.current)
  //mayFlyer(mapContainer.current, siteRef.current);
  
  //LEGENDD
  
  legendColorRef.current = L.control({ position: "topright", id:12 });
  legendColorRef.current.onAdd = function() {
          var div = L.DomUtil.create("div", "legend");
          div.innerHTML += "<h4>Legend</h4>";
          div.innerHTML += '<img src="'+baseurl+'FinalDS/Present/Nanumaga_out10-yearARI.nc?version=1.3.0&request=GetLegendGraphic&LAYERS=Depth&STYLES=default-scalar/div-Spectral-inv&numcolorbands=250&transparent=TRUE&width=50&height=200&colorscalerange=0,2" alt="Legend">';
         return div;
        };
        legendColorRef.current.addTo(mapContainer.current);
  //Popup
  mapContainer.current.on('popupopen', function (e) {
  if(displayRef.current){
    mapContainer.current.closePopup();
  }
  
  });
/*
  mapContainer.current.on('zoomend',function(e){
   console.log(e.sourceTarget)
  });
*/
L.simpleMapScreenshoter().addTo(mapContainer.current);



if (nameer[0] === "Tuvalu"){


toast.info('Click on marker to zoom.', {position: toast.POSITION.BOTTOM_CENTER, autoClose:6000})
layer3.current = addTVMarker(mapContainer.current, "Nanumaga").on('click', function(e) {onClickShow2('Nanumaga')}).bindTooltip("Nanumaga", {permanent:true,opacity:0.65});
layer3.current = addTVMarker(mapContainer.current, "Nanumea").on('click', function(e) {onClickShow2('Nanumea')}).bindTooltip("Nanumea", {permanent:true,opacity:0.65});
layer3.current = addTVMarker(mapContainer.current, "Funafuti").on('click', function(e) {onClickShow2('Funafuti')}).bindTooltip("Funafuti", {permanent:true,opacity:0.65});
layer3.current = addTVMarker(mapContainer.current, "Nui").on('click', function(e) {onClickShow2('Nui')}).bindTooltip("Nui", {permanent:true,opacity:0.65});
layer3.current = addTVMarker(mapContainer.current, "Nukufetau").on('click', function(e) {onClickShow2('Nukufetau')}).bindTooltip("Nukufetau", {permanent:true,opacity:0.65});
layer3.current = addTVMarker(mapContainer.current, "Niutao").on('click', function(e) {onClickShow2('Niutao')}).bindTooltip("Niutao", {permanent:true,opacity:0.65});
layer3.current = addTVMarker(mapContainer.current, "Nukulaelae").on('click', function(e) {onClickShow2('Nukulaelae')}).bindTooltip("Nukulaelae", {permanent:true,opacity:0.65});
layer3.current = addTVMarker(mapContainer.current, "Vaitupu").on('click', function(e) {onClickShow2('Vaitupu')}).bindTooltip("Vaitupu", {permanent:true,opacity:0.65});
layer3.current = addTVMarker(mapContainer.current, "Niulakita").on('click', function(e) {onClickShow2('Niulakita')}).bindTooltip("Niulakita", {permanent:true,opacity:0.65});
}
else{
  shorelineLayer.current = addShorelineImagenoPaneGen(mapContainer.current, siteRef.current)

   mayFlyer(mapContainer.current, siteRef.current);
} 
}
useEffect(() => {  
  
if (_isMounted.current){
  initMap(url);
  
}  
return () => { _isMounted.current = false }; 
},[]);



const onClickShow2= async(siteName) => {
  siteRef.current = siteName;
  siteRef2.current = siteName;
 // mapContainer.current.removeLayer(layer.current);
 // mapContainer.current.removeLayer(shorelineLayer.current);
  shorelineLayer.current = addShorelineImagenoPaneGen(mapContainer.current, siteRef.current)
  console.log(siteRef.current)
 
  mayFlyer(mapContainer.current, siteRef.current);

   mapContainer.current.eachLayer(function (layer) {
    const layername = layer.options.id;
    console.log(layername)
    if(layername === 777){
      mapContainer.current.removeLayer(layer);
    }
  });
   
   setGlobalState("island_name", siteName);
};

const handleSite=(e)=>{
  if (e.target.value === "Tuvalu"){
    
toast.info('Click on marker to zoom.', {position: toast.POSITION.BOTTOM_CENTER, autoClose:6000})
    mapContainer.current.removeLayer(layer.current);
    mapContainer.current.removeLayer(shorelineLayer.current);
    layer3.current = addTVMarker(mapContainer.current, "Nanumaga").on('click', function(e) {onClickShow2('Nanumaga')}).bindTooltip("Nanumaga", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Nanumea").on('click', function(e) {onClickShow2('Nanumea')}).bindTooltip("Nanumea", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Funafuti").on('click', function(e) {onClickShow2('Funafuti')}).bindTooltip("Funafuti", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Nui").on('click', function(e) {onClickShow2('Nui')}).bindTooltip("Nui", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Nukufetau").on('click', function(e) {onClickShow2('Nukufetau')}).bindTooltip("Nukufetau", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Niutao").on('click', function(e) {onClickShow2('Niutao')}).bindTooltip("Niutao", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Nukulaelae").on('click', function(e) {onClickShow2('Nukulaelae')}).bindTooltip("Nukulaelae", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Vaitupu").on('click', function(e) {onClickShow2('Vaitupu')}).bindTooltip("Vaitupu", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Niulakita").on('click', function(e) {onClickShow2('Niulakita')}).bindTooltip("Niulakita", {permanent:true,opacity:0.65});


  mayFlyer(mapContainer.current, 'Tuvalu');
  }
  else{
  siteRef.current = e.target.value;
  siteRef2.current = e.target.value;
  if(layer.current !== null){
    mapContainer.current.removeLayer(layer.current);
  }
  if(shorelineLayer.current !== null){
    mapContainer.current.removeLayer(shorelineLayer.current);
  }
  mapContainer.current.eachLayer(function (layer) {
    const layername = layer.options.id;
    console.log(layername)
    if(layername === 777){
      mapContainer.current.removeLayer(layer);
    }
  });
  shorelineLayer.current = addShorelineImagenoPaneGen(mapContainer.current, siteRef.current)
  console.log(siteRef.current)

  mayFlyer(mapContainer.current, e.target.value);
  }

   setGlobalState("island_name", e.target.value);
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
      <select className="form-select form-select-sm" value={nameer[0]} aria-label=".form-select-sm example" onChange={handleSite} style={{fontSize:'13px', paddingLeft:1}}>
      <option value="Tuvalu">Tuvalu</option>
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
    </div>
  </div>

      </div>
      <div className="col-sm-10" style={{padding:0}}>
      <div id="map" ref={mapContainer} style={{width:"100%", height:"100%",Zindex: "auto"}}></div>
      </div>
    </div>
  </div>

  )
}
export default Dem;
