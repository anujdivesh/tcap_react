import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import "./testmap.css";
import "./radio.css";
import { saveAs } from "file-saver";
import {mayFlyer,addShorelineImagenoPaneGen,addRisk, getChartOptions,getYaxis} from "./helper";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar} from 'react-chartjs-2';

const Report = () => {
 
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    {
      id: 'no_data_label',
      beforeDraw: function (chart, easing) {
        var ctx = chart.ctx;
        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      }
  }
  );

  const shorelineLayer = useRef();
  const baseLayer = useRef();
  //const layer2 = useRef();
  const _isMounted = useRef(true);
  const mapContainer = React.useRef(null);
  //const url_risk = "https://opm.gem.spc.int/tcap/risk-plots";
  const yearRef = useRef(5);
  const siteRef = useRef("Tuvalu");
  const horizonRef = useRef("2060");
  const climateRef = useRef("SSP2");
  const presentBoolRef = useRef(true);
  const [abool, setabool] = useState(false);
  const [economicbool, seteconomicbool] = useState(false);
  const [expo, setExpo] = useState(true);
  const assetRef = useRef("population");
  const typeRef = useRef("exposed");
  const siteRefBool = useRef(true);
  const [data, setData] = useState({labels:[],datasets:[]});
  
  const [displayShape, setDisplayShape] = useState(false);
  const risklayer = useRef();
  const [display2, setDisplay2] = useState(false);
  const [display3, setDisplay3] = useState(false);
  const [chartOptionsData, setChartOptionsData] = useState(getChartOptions);

  const chartOptions = (title, ylabel, xlabel, bool, isStacked) => {
    var yy ={
      min: 0,
      max: 100,
      stepSize: 20,
      stacked: false,
      ticks: {
        beginAtZero: true,
      },
      title: {
        display: true,
        text: ylabel
      }
    };
    if (!bool){
      yy ={
        stacked: false,
        ticks: {
          beginAtZero: true,
        },
        title: {
          display: true,
          text: ylabel
        }
      };
    }
    if (!isStacked){
      yy ={
        min: 0,
        max: 100,
        stepSize: 20,
        stacked: false,
        ticks: {
          beginAtZero: true,
        },
        title: {
          display: true,
          text: ylabel
        }
      };
    }
    setChartOptionsData({
      plugins: {
        tooltip: {
            callbacks: {
                label: function(context) {
                    var label = context.dataset.label || '';
                    var unit = '%';
                    if (!bool){
                      unit = '';
                    }
                    if (context.parsed.y !== null) {
                        label += ' ' +Math.round(context.parsed.y,1) + unit;
                    }
                    return label;
                }
            }
        },
        title: {
          display: true,
          text: title
      },
    },
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: xlabel
          }
        },
        y: yy,
      }
    
    
    });
  };
  /*
  const chart = (presentArr) => {
    setChartData({
      labels:["5","10","25", '50','100','250'],
      datasets:[{
        label:'Present',
        backgroundColor: 'rgb(53, 162, 235)',
        stack: 'Stack 1',
        data:presentArr
      
      },
      {
      label:'SSP2-4.5(2060)',
      backgroundColor: 'rgb(255, 99, 132)',
      stack: 'Stack 0',
        data:[8,5,4,8,5,4]
  
    },
    {
      label:'SSP2-4.5(2100)',
      backgroundColor: 'rgb(75, 192, 192)',
      stack: 'Stack 0',
      data:[20,50,30,20,50,30]
  
  },
  {
    label:'SSP2-4.5(2060)',
    backgroundColor: 'rgb(153, 102, 255)',
    stack: 'Stack 2',
      data:[8,5,4,8,5,4]
  
  },
  {
    label:'SSP2-4.5(2100)',
    backgroundColor: 'rgb(255, 159, 64)',
    stack: 'Stack 2',
    data:[100,100,100,100,100,100]
  
  }]
  });
  };
*/
  const fetchData= async(island, varib,yaxis,bool,isStacked)=> {
    const url = "https://opm.gem.spc.int/cgi-bin/Risk/test2.py?island="+island+"&var="+varib;
    console.log(url)
    var presentArr = [];
var SSP452060 = [];
var SSP452100 = [];
var SSP852060 = [];
var SSP852100 = [];
  await fetch(url).then((data)=> {
      const res = data.json();
      return res
  }).then((res) => {
    var horizon = ['Present', 'SSP2-4.5(2060)', 'SSP2-4.5(2100)', 'SSP5-8.5(2060)', 'SSP5-8.5(2100)'];
    var return_periods = [5,10,25,50,100,250];

    for (let i = 0; i < res.length; ++i){
      var ARI = res[i]['ARI'];
      var Scenario = res[i]['Scenario'];
      var Percentage_Exposed_Population = res[i]['data'];
      var sss = Scenario.replace(/\s/g, "")
   // presentArr.push(i)
      
      for (let j = 0; j < return_periods.length; ++j){
        if (ARI === return_periods[j] && sss === horizon[0]){

          presentArr.push(Percentage_Exposed_Population)
        }
        if (ARI === return_periods[j] && sss === horizon[1]){

          SSP452060.push(Percentage_Exposed_Population)
        }
        if (ARI === return_periods[j] && sss === horizon[2]){
          if(isStacked){
          SSP452100.push(Percentage_Exposed_Population)}
          else{
            SSP452100.push(Percentage_Exposed_Population)
          }
        }
        if (ARI === return_periods[j] && sss === horizon[3]){

          SSP852060.push(Percentage_Exposed_Population)
        }
        if (ARI === return_periods[j] && sss === horizon[4]){
          if(isStacked){
          SSP852100.push(Percentage_Exposed_Population)}
          else{
            SSP852100.push(Percentage_Exposed_Population)
          }
        }
      }
  
    }
    chartOptions(yaxis[0], yaxis[1], yaxis[2], bool,isStacked)

    var stack1 = 'Stack 1';
    var stack0 = 'Stack 0';
    var stack3 = 'Stack 0';
    var stack2 = 'Stack 2';
    var stack4 = 'Stack 2';
    if (!isStacked){
      stack3 = 'Stack 3';
      stack4 = 'Stack 4';
    }
     setData({
      labels:["5","10","25", '50','100','250'],
      datasets:[{
        label:'Present',
        backgroundColor: '#fd7f6f',
        stack: stack1,
        data:presentArr
      
      },
      {
      label:'SSP2-4.5(2060)',
      backgroundColor: '#7eb0d5',
      stack: stack0,
        data:SSP452060
  
    },
    {
      label:'SSP2-4.5(2100)',
      backgroundColor: '#b2e061',
      stack: stack3,
      data:SSP452100
  
  },
  {
    label:'SSP2-4.5(2060)',
    backgroundColor: '#bd7ebe',
    stack: stack2,
      data:SSP852060
  
  },
  {
    label:'SSP2-4.5(2100)',
    backgroundColor: '#ffb55a',
    stack: stack4,
    data:SSP852100
  
  }]
  })
  }).catch(e => {
         console.log("error", e)
     })
 }

 const fetchDataCountry= async(retur, asset, type, horizon, gender,yaxis,bool,isStacked)=> {
  var namee = gender+"-";
  if (gender === 'SSP2'){
    namee += "4.5(";
  }
  else{
    namee += "8.5(";
  }
  if (horizon ==='present'){
    namee = 'Present';
  }
  else{
    namee+=horizon+")";
  }
  const url = "https://opm.gem.spc.int/cgi-bin/Risk/country.py?island="+retur+"&var="+asset+"_"+type+"&scenario="+namee;
  var presentArr = [];
await fetch(url).then((data)=> {
    const res = data.json();
    return res
}).then((res) => {

  for (let i = 0; i < res.length-1; ++i){
    var prev = res[i]['data'];
    presentArr.push(prev)

  }
  console.log(yaxis)
  //var title = yaxis[0]+" ["+retur+" year "+namee+"]";
  var title = yaxis[0]+" ["+retur+" year]";
  chartOptions(title, yaxis[1], yaxis[2], bool,isStacked)

  var stack1 = 'Stack 1';
   setData({
    labels:["Funafuti","Nanumaga","Nanumea", 'Niulakita','Niutao','Nui','Nukufetau','Nukulaelae','Vaitupu'],
    datasets:[{
      label:namee,
      backgroundColor: '#c86558',
      stack: stack1,
      data:presentArr
    
    }]
})
}).catch(e => {
       console.log("error", e)
   })
}
  function initMap(){
       baseLayer.current = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
         attribution: '&copy; Pacific Community (OSM)',
         detectRetina: true
     });
   
     mapContainer.current = L.map('map', {
       zoom: 7,
       center: [-6.287321, 176.320346]
     });
     baseLayer.current.addTo(mapContainer.current); 
   //  layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,display3,country)

shorelineLayer.current = addShorelineImagenoPaneGen(mapContainer.current, siteRef.current)
mayFlyer(mapContainer.current, siteRef.current);

     }
   useEffect(() => {  
     
   if (_isMounted.current){
   
     initMap();
     
fetchDataCountry(yearRef.current, asset,type,horizon, gender, getYaxis('Tuvalu',asset,type),true, true);
   }  
   return () => { _isMounted.current = false }; 
   },[]);
   
const handleSite=(e)=>{
//var random = Array.from({length: 3}, () => Math.floor(Math.random() * 40));
  //chart(random);
  //chartOptions('Anuj Divesh')
  siteRef.current = e.target.value;
  setHorizon('present')
  if (e.target.value !== "Tuvalu"){
   // setCountry('island')
    setDisplayShape(true)
    setDisplay2(true)
    setDisplay3(true)
    if (assetRef.current === "population"){
      setExpo(true)
    }
    else{
      setExpo(false)
    }

  }
  else{
    setDisplay2(false)
    setDisplay3(true)
    setDisplayShape(false)
    setExpo(false)
    setCountry('island')

  }
  setAsset('population')
  setType('exposed')
  setExpo(true)
  fetchData(e.target.value, "population_exposed", getYaxis(e.target.value,'population','exposed'),true,true);



  if (e.target.value !== "Tuvalu"){
    //setDisplay2(true)
    siteRefBool.current = false;
   
  }
  else{
    //setDisplay2(false)
    siteRefBool.current = true;
    
  }

  seteconomicbool(false)
  if (shorelineLayer.current != null){
  mapContainer.current.removeLayer(shorelineLayer.current);
  }
 // if (layer2.current != null){
   // mapContainer.current.removeLayer(layer2.current);
    //}
  shorelineLayer.current = addShorelineImagenoPaneGen(mapContainer.current, siteRef.current)
  //layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,display3,country)
  mayFlyer(mapContainer.current, siteRef.current);

  if (e.target.value !== "Tuvalu"){
    risklayer.current = addRisk(mapContainer.current, siteRef.current, yearRef.current,climateRef.current, presentBoolRef.current, horizonRef.current, 'risk')
 
  }
  else{
    mapContainer.current.eachLayer(function (layer) {
      if (layer.defaultOptions != null){
        if (layer.defaultOptions.id === "risk"){
          mapContainer.current.removeLayer(layer);
        }
      }
   });
  }
   
}

const [gender, setGender] = useState("SSP2");



const [horizon, setHorizon] = useState("present");



const [asset, setAsset] = useState("population");
const [country, setCountry] = useState("tuvalu");

const [type, setType] = useState("exposed");
function onChangeValueAsset(e) {
  if (country === 'island' || siteRef.current !== "Tuvalu"){
    if (e.target.value === 'population'){
      fetchData(siteRef.current, e.target.value+"_exposed",getYaxis(siteRef.current,e.target.value,type),true,true);
    }
    else{
    fetchData(siteRef.current, e.target.value+"_"+type,getYaxis(siteRef.current,e.target.value,type),true,true);
    }
  }
  else{

    fetchDataCountry("5", e.target.value,'exposed',horizon, gender, getYaxis('Tuvalu',e.target.value,'exposed'),true, true);
  }

 // if (siteRef.current !== "Tuvalu"){
    if (e.target.value === "population"){
      setExpo(true)
      typeRef.current= 'exposed';
      setType("exposed")
    }
    else{
      setExpo(false)
    }
 
  setAsset(e.target.value);
  assetRef.current = e.target.value
//mapContainer.current.removeLayer(layer2.current);
//layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,display3,country)
//mayFlyer(mapContainer.current, siteRef.current);

 e.currentTarget.blur();
}


function onChangeValueTV(e) {
  setType('exposed');

  //var view = true;
   if (e.target.value !== "tuvalu"){
    fetchData(siteRef.current, asset+"_"+type,getYaxis(siteRef.current,asset,type),true,true);
    setDisplay3(true)
   }
   else{
  fetchDataCountry("5", 'population','exposed',horizon, gender, getYaxis('Tuvalu','population','exposed'),true, true);
    setDisplay3(false)
   // view = false;
   }
 //    if (e.target.value === "population"){
   //    setExpo(true)
     //  typeRef.current= 'exposed';
       //setType("exposed")
    // }
     //else{
      // setExpo(false)
     //}
  
   setCountry(e.target.value);
   //mapContainer.current.removeLayer(layer2.current);
  // layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,view,e.target.value)

  // assetRef.current = e.target.value
 //mapContainer.current.removeLayer(layer2.current);
 //layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current)
 //mayFlyer(mapContainer.current, siteRef.current);
 
  e.currentTarget.blur();
 }


function onChangeValueType(e) {
  var vool, stacked = true;
  if (e.target.value === 'damanged'){
    stacked = false
  }
  if (e.target.value === "numexposed" || e.target.value === 'economicdamage'){
    vool = false
  }
  if (country === 'island'|| siteRef.current !== "Tuvalu"){

    fetchData(siteRef.current, asset+"_"+e.target.value,getYaxis(siteRef.current,asset,e.target.value),vool,stacked);
  }
  else{

    fetchDataCountry("5", asset,e.target.value,horizon, gender, getYaxis('Tuvalu',asset,e.target.value),true, true);
  }

  console.log(e.target.value)
  if (e.target.value === "annual"){
    setabool(true)
  }
  else{
    setabool(false)
  }
/*
  if (e.target.value === "annualeconomic"){
    seteconomicbool(true)
  }
  else{
    seteconomicbool(false)
  }*/
  setType(e.target.value);
    presentBoolRef.current = false;
    typeRef.current = e.target.value;
//mapContainer.current.removeLayer(layer2.current);
//layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,display3,country)
//mayFlyer(mapContainer.current, siteRef.current);
 e.currentTarget.blur();
}

//Tuvalu Scale


const handleYear=(e)=>{
  yearRef.current = e.target.value;
  //mapContainer.current.removeLayer(layer2.current);
 // layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,display3,country)
  //mayFlyer(mapContainer.current, siteRef.current);
 

    fetchDataCountry(e.target.value, asset,type,horizon, gender, getYaxis('Tuvalu',asset,type),true, true);
 // }
 
}

function onChangeValue(e) {
  setGender(e.target.value);
  climateRef.current = e.target.value
    presentBoolRef.current = false;
//mapContainer.current.removeLayer(layer2.current);
//layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,display3,country)
//mayFlyer(mapContainer.current, siteRef.current);

fetchDataCountry(yearRef.current, asset,type,horizon, e.target.value, getYaxis('Tuvalu',asset,type),true, true);
 e.currentTarget.blur();
}


function onChangeValueHorizon(e) {
  setHorizon(e.target.value);
  horizonRef.current = e.target.value

  if (e.target.value !== "present"){
    presentBoolRef.current = false;
 // yearRef.current = e.target.value;
//mapContainer.current.removeLayer(layer2.current);
//layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,display3,country)
//mayFlyer(mapContainer.current, siteRef.current);

}
else{
 // setHorizon2('present')
  presentBoolRef.current = true;
 // mapContainer.current.removeLayer(layer2.current);
 // layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,display3,country)
  //mayFlyer(mapContainer.current, siteRef.current);

}

fetchDataCountry(yearRef.current, asset,type,e.target.value, gender, getYaxis('Tuvalu',asset,type),true, true);
 e.currentTarget.blur();
}




//Buildings Shapefile *************************
const handleYearShape=(e)=>{
  yearRef.current = e.target.value;
  mapContainer.current.eachLayer(function (layer) {
    if (layer.defaultOptions != null){
      if (layer.defaultOptions.id === "risk"){
        mapContainer.current.removeLayer(layer);
      }
    }
 });
  risklayer.current = addRisk(mapContainer.current, siteRef.current, yearRef.current,climateRef.current, presentBoolRef.current, horizonRef.current, 'risk')
  
 
}

function onChangeValueHorizonShape(e) {
  setHorizon(e.target.value);
  horizonRef.current = e.target.value

  if (e.target.value !== "present"){
    presentBoolRef.current = false;
    mapContainer.current.eachLayer(function (layer) {
      if (layer.defaultOptions != null){
        if (layer.defaultOptions.id === "risk"){
          mapContainer.current.removeLayer(layer);
        }
      }
   });
    risklayer.current = addRisk(mapContainer.current, siteRef.current, yearRef.current,climateRef.current, presentBoolRef.current, horizonRef.current, 'risk')
    
   

}
else{
  presentBoolRef.current = true;
  mapContainer.current.eachLayer(function (layer) {
    if (layer.defaultOptions != null){
      if (layer.defaultOptions.id === "risk"){
        mapContainer.current.removeLayer(layer);
      }
    }
 });
  risklayer.current = addRisk(mapContainer.current, siteRef.current, yearRef.current,climateRef.current, presentBoolRef.current, horizonRef.current, 'risk')
  
 

}
 e.currentTarget.blur();
}
function onChangeValueShape(e) {
  setGender(e.target.value);
  climateRef.current = e.target.value
    presentBoolRef.current = false;
//mapContainer.current.removeLayer(layer2.current);
//layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current)
mapContainer.current.eachLayer(function (layer) {
  if (layer.defaultOptions != null){
    if (layer.defaultOptions.id === "risk"){
      mapContainer.current.removeLayer(layer);
    }
  }
});
risklayer.current = addRisk(mapContainer.current, siteRef.current, yearRef.current,climateRef.current, presentBoolRef.current, horizonRef.current, 'risk')



 e.currentTarget.blur();
}


const handleSubmit=(e)=>{
/*  saveAs(
    getURL(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,display3,country),
    "risk.png"
  );
*/
const canvasSave = document.getElementById('stack');
canvasSave.toBlob(function (blob) {
    saveAs(blob, "Export.png")
})

e.currentTarget.blur();
}


  return (
    <>
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
      {display2 ?
      null
 : <>
 <hr style={{marginTop:0}}/>
 <div className="row" style={{marginTop:'-10px'}}>
<div className="col-sm-6">
<div className="form-check">
             <input type="radio" className="form-check-input" value="tuvalu" id="tuvalu"
           name="country" onChange={onChangeValueTV} checked={country === "tuvalu"}/>
        <label>Island Scale</label>
        </div>
 </div>
 <div className="col-sm-6">

        <div className="form-check">
             <input type="radio" className="form-check-input" value="island" id="island"
          name="country" onChange={onChangeValueTV} checked={country === "island"}/>
        <label>Country Scale</label>
        </div>
 </div>
 </div>
 </>}
      <hr style={{marginTop:0}}/>
      <div className="row" style={{marginTop:'-10px'}}>
    <div className="col-sm-6">

    <p>Asset:</p>
      </div>
      <div className="col-sm-6">
      <div className="form-check">
                  <input type="radio" className="form-check-input" value="population" id="population"
                name="asset" onChange={onChangeValueAsset} checked={asset === "population"} disabled={abool || economicbool} />
             <label>Population</label>
             </div>
             <div className="form-check">
                  <input type="radio" className="form-check-input" value="building" id="building"
               name="asset" onChange={onChangeValueAsset} checked={asset === "building"} disabled={abool || economicbool} />
             <label>Buildings</label>
             </div>
      </div>
      </div>
      <hr style={{marginTop:0}}/>
      <div className="row" style={{marginTop:'-10px'}}>
    <div className="col-sm-6">

    <p>Impact Type:</p>
      </div>
      <div className="col-sm-6">
      <div className="form-check">
                  <input type="radio" className="form-check-input" value="exposed" id="exposed"
                name="type" onChange={onChangeValueType} checked={type === "exposed"} />
                {display3 ?
             <label>% Exposed</label>
             : <label>Exposed</label>}
             </div>
             <>{display3 ?
             <>
              <div className="form-check">
                  <input type="radio" className="form-check-input" value="numexposed" id="numexposed"
                name="type" onChange={onChangeValueType} checked={type === "numexposed"} disabled={ expo}/>
             <label># Exposed</label>
             </div>
            
             <div className="form-check">
                  <input type="radio" className="form-check-input" value="economicdamage" id="economicdamage"
               name="type" onChange={onChangeValueType} checked={type === "economicdamage"} disabled={ expo}/>
             <label>Economic Damage</label>
             </div>

              <div className="form-check">
              <input type="radio" className="form-check-input" value="damanged" id="damanged"
              name="type" onChange={onChangeValueType} checked={type === "damanged"} disabled={ expo}/>
              <label>% Damaged</label>
              </div>
              </>
              : null}
              </>
             
             
             
      </div>
      </div>
     
      {display3 || display2 ?
      null
 : <>
      <hr style={{marginTop:0}}/>
     

      <div className="row"style={{marginTop:'-7px'}}>
<div className="col-sm-6">

<p>Return Period:</p>
  </div>

  <div className="col-sm-6">
  <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleYear} id="Year2" name="Year2" style={{fontSize:'13px', paddingLeft:1}}>
<option value="5">5 Year</option>
<option value="10">10 Year</option>
<option value="25">25 Year</option>
<option value="50">50 Year</option>
<option value="100">100 Year</option>
<option value="250">250 Year</option>
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
               name="horizonShape" onChange={onChangeValueHorizon} checked={horizon === "present"} disabled={ economicbool}/>
             <label>Present Climate </label>
             </div>
      <div className="form-check">
                  <input type="radio" className="form-check-input" value="2060" id="2060"
                name="horizonShape" onChange={onChangeValueHorizon} checked={horizon === "2060"} disabled={ economicbool}/>
             <label>2060</label>
             </div>
             <div className="form-check">
                  <input type="radio" className="form-check-input" value="2100" id="2100"
                name="horizonShape" onChange={onChangeValueHorizon} checked={horizon === "2100"} disabled={ economicbool}/>
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
                name="climateShape" onChange={onChangeValue} checked={gender === "SSP2"} disabled={presentBoolRef.current || economicbool }/>
             <label>SSP2 4.5</label>
             </div>
             <div className="form-check">
                  <input type="radio" className="form-check-input" value="SSP5" id="SSP5"
               name="climateShape" onChange={onChangeValue} checked={gender === "SSP5"} disabled={presentBoolRef.current || economicbool}/>
             <label>SSP5 8.5</label>
             </div>
      </div>
      </div>

    
     </>}

    
    
    </div>
  </div>




  {displayShape ?
      <>
        <div className="row" style={{marginTop:'10px', marginBottom:'-15px'}}>
        <div className="col-sm-12" style={{marginLeft:'15px'}}>
          <p style={{fontSize:'13px'}}>Building Shapefile:</p>
          </div>
          </div>
  <div className="card"  style={{marginTop:"0px"}}>
    <div className="card-body" style={{fontSize:"13px"}}>
  
      <div className="row"style={{marginTop:'0px'}}>
<div className="col-sm-6">

<p>Return Period:</p>
  </div>

  <div className="col-sm-6">
  <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleYearShape} id="Year2" name="Year2" style={{fontSize:'13px', paddingLeft:1}}>
<option value="5">5 Year</option>
<option value="10">10 Year</option>
<option value="25">25 Year</option>
<option value="50">50 Year</option>
<option value="100">100 Year</option>
<option value="250">250 Year</option>
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
               name="horizonShape" onChange={onChangeValueHorizonShape} checked={horizon === "present"} disabled={ economicbool}/>
             <label>Present Climate </label>
             </div>
      <div className="form-check">
                  <input type="radio" className="form-check-input" value="2060" id="2060"
                name="horizonShape" onChange={onChangeValueHorizonShape} checked={horizon === "2060"} disabled={ economicbool}/>
             <label>2060</label>
             </div>
             <div className="form-check">
                  <input type="radio" className="form-check-input" value="2100" id="2100"
                name="horizonShape" onChange={onChangeValueHorizonShape} checked={horizon === "2100"} disabled={ economicbool}/>
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
                name="climateShape" onChange={onChangeValueShape} checked={gender === "SSP2"} disabled={presentBoolRef.current || economicbool }/>
             <label>SSP2 4.5</label>
             </div>
             <div className="form-check">
                  <input type="radio" className="form-check-input" value="SSP5" id="SSP5"
               name="climateShape" onChange={onChangeValueShape} checked={gender === "SSP5"} disabled={presentBoolRef.current || economicbool}/>
             <label>SSP5 8.5</label>
             </div>
      </div>
      </div>
      </div>
      </div>
      </>
 : null}
    </div>
    <div className="col-sm-10" style={{padding:0}}>
    <div id="map" ref={mapContainer} className="map"></div>
    <div className="container">

    <pre><code className="javascript" id="code"></code></pre>
    <div className="row"style={{marginTop:'0px', height:'350px'}}>
    {

<Bar id="stack" options={chartOptionsData} data={data}/>

    }
</div>
<div className="row"style={{marginTop:'10px', textAlign:'center'}}>

<div className="col-sm-10">

</div>
<div className="col-sm-2">

<button type="button" className="btn btn-primary" onClick={handleSubmit}>Download File</button>

</div>
</div>
</div>

</div>
</div>
    </div>
</>
  );

};

export default Report;
