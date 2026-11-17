import { useEffect, useRef, useState } from "react";
import maplibregl, { type Map as MapView, type Marker } from "maplibre-gl";
import { Activity, AlertTriangle, ArrowDownToLine, BarChart3, Cloud, Database, Layers3, Pause, Play, RotateCcw, Settings2, Wind } from "lucide-react";

const cities = [
  { name: "London", country: "UK", lng: -0.1276, lat: 51.5072, value: "0.34", level: "LOW" },
  { name: "Paris", country: "France", lng: 2.3522, lat: 48.8566, value: "2.40", level: "MODERATE" },
  { name: "Frankfurt", country: "Germany", lng: 8.6821, lat: 50.1109, value: "5.80", level: "HIGH" },
  { name: "Oslo", country: "Norway", lng: 10.7522, lat: 59.9139, value: "0.08", level: "VERY LOW" },
  { name: "Stockholm", country: "Sweden", lng: 18.0686, lat: 59.3293, value: "0.04", level: "VERY LOW" },
];
const dates = ["14 APR 2010", "18 APR 2010", "22 APR 2010", "26 APR 2010", "30 APR 2010", "04 MAY 2010"];

export default function App() {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapView | null>(null);
  const markers = useRef<Marker[]>([]);
  const [mode, setMode] = useState<"reconstruction" | "experiment">("reconstruction");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(10);
  const [progress, setProgress] = useState(24);
  const [ash, setAsh] = useState(true);
  const [wind, setWind] = useState(true);
  const [settings, setSettings] = useState(false);
  const [rate, setRate] = useState(65);
  const [size, setSize] = useState("Fine ash");
  const date = dates[Math.min(5, Math.floor(progress / 17))];

  useEffect(() => {
    if (!mapElement.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: mapElement.current,
      center: [4, 56],
      zoom: 3.2,
      minZoom: 2,
      style: {
        version: 8,
        sources: { osm: { type: "raster", tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png", "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png", "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256, attribution: "© OpenStreetMap contributors" } },
        layers: [{ id: "base", type: "raster", source: "osm", paint: { "raster-saturation": -0.78, "raster-contrast": 0.12, "raster-brightness-min": 0.12, "raster-brightness-max": 0.75 } }],
      },
      attributionControl: true,
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.on("load", () => {
      map.addSource("ash", { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [[[-24,63],[-18,65],[-9,66],[-1,65],[8,62],[14,58],[13,54],[7,52],[0,53],[-8,56],[-16,59],[-24,63]]] } } });
      map.addLayer({ id: "ash-fill", type: "fill", source: "ash", paint: { "fill-color": "#d6a27d", "fill-opacity": 0.18 } });
      map.addLayer({ id: "ash-line", type: "line", source: "ash", paint: { "line-color": "#e9a16e", "line-opacity": 0.6, "line-width": 1.4, "line-dasharray": [2, 2] } });
      const volcano = document.createElement("div");
      volcano.className = "volcano-marker";
      volcano.innerHTML = '<span></span>';
      new maplibregl.Marker({ element: volcano }).setLngLat([-19.62, 63.63]).addTo(map);
      markers.current = cities.map((city) => {
        const el = document.createElement("div");
        el.className = "city-marker";
        el.innerHTML = '<i></i><b>' + city.name + '</b>';
        return new maplibregl.Marker({ element: el }).setLngLat([city.lng, city.lat]).addTo(map);
      });
    });
    mapRef.current = map;
    return () => { markers.current.forEach((m) => m.remove()); map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    ["ash-fill", "ash-line"].forEach((id) => { if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", ash ? "visible" : "none"); });
  }, [ash]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setProgress((p) => { if (p >= 100) { setPlaying(false); return 100; } return Math.min(100, p + speed * 0.035); }), 100);
    return () => window.clearInterval(timer);
  }, [playing, speed]);

  const exportSnapshot = () => {
    const payload = { project: "YJH's Iceland Volcano Simulator", mode, progress, date, note: "Synthetic demonstration values only; not validated scientific output.", cities };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = "iceland-simulator-demo.json"; a.click(); URL.revokeObjectURL(url);
  };

  return <div className="app-shell">
    <header className="topbar"><div className="brand"><div className="brand-mark"><Activity size={19}/></div><div><div className="brand-title">YJH'S ICELAND <span>VOLCANO SIMULATOR</span></div><div className="brand-subtitle">ATMOSPHERIC ASH DISPERSION LABORATORY</div></div></div><div className="topbar-right"><span className="status-pill"><i/> PROTOTYPE ENVIRONMENT</span><span className="top-divider"/><button className="icon-button" onClick={() => setSettings(!settings)}><Settings2 size={17}/></button><div className="avatar">YJH</div></div></header>
    <main className="workspace">
      <aside className="sidebar"><div className="section-kicker">SIMULATION CONTROL</div>
        <div className="mode-switch"><button className={mode === "reconstruction" ? "selected" : ""} onClick={() => setMode("reconstruction")}>↻ RECONSTRUCTION</button><button className={mode === "experiment" ? "selected" : ""} onClick={() => setMode("experiment")}>⚙ EXPERIMENT</button></div>
        <div className="event-card"><div className="event-top"><span className="event-tag">● 2010 ERUPTION</span><span className="event-year">ICELAND</span></div><h2>Eyjafjallajökull</h2><p>North Atlantic · Southern Iceland</p><div className="event-meta"><div><span>ERUPTION START</span><b>14 APR 2010</b></div><div><span>ERUPTION END</span><b>22 MAY 2010</b></div></div></div>
        <div className="control-block"><div className="block-heading"><span>TIME CONTROL</span><span className="muted-label">UTC</span></div><div className="date-display"><div className="date-icon"><Activity size={16}/></div><div><strong>{date}</strong><small>Simulation timeline</small></div><span className="date-step">2010</span></div><input className="timeline" type="range" min="0" max="100" value={progress} onChange={e => setProgress(Number(e.target.value))}/><div className="timeline-labels"><span>14 APR</span><span>22 MAY 2010</span></div><div className="transport"><button className="play-button" onClick={() => setPlaying(!playing)}>{playing ? <Pause size={16}/> : <Play size={16}/>} {playing ? "PAUSE" : "START SIMULATION"}</button><button className="reset-button" onClick={() => {setPlaying(false);setProgress(0);}}><RotateCcw size={16}/></button></div><div className="speed-row"><span>PLAYBACK SPEED</span><div className="speed-options">{[1,5,10,50,100,500].map(v => <button key={v} className={speed === v ? "active" : ""} onClick={() => setSpeed(v)}>×{v}</button>)}</div></div></div>
        {mode === "experiment" && <div className="control-block"><div className="block-heading"><span>EXPERIMENT PARAMETERS</span><span className="muted-label">EDITABLE</span></div><label className="field-label">Emission rate <b>{rate}%</b></label><input type="range" min="10" max="150" value={rate} onChange={e => setRate(Number(e.target.value))}/><label className="field-label">Particle size class</label><select value={size} onChange={e => setSize(e.target.value)}><option>Fine ash</option><option>Medium ash</option><option>Coarse ash</option></select><p className="hint">UI controls only. The validated plume-rise and source model is not connected.</p></div>}
        <div className="control-block"><div className="block-heading"><span>MAP LAYERS</span><Layers3 size={14}/></div><label className="layer-row"><span className="layer-icon ash"><Cloud size={15}/></span><span><b>Ash concentration</b><small>Illustrative plume footprint</small></span><input type="checkbox" checked={ash} onChange={e => setAsh(e.target.checked)}/></label><label className="layer-row"><span className="layer-icon wind"><Wind size={15}/></span><span><b>Wind barbs</b><small>ERA5 wind field · pending</small></span><input type="checkbox" checked={wind} onChange={e => setWind(e.target.checked)}/></label><div className="wind-note">{wind ? "Wind barb overlay is a planned data layer." : "Wind barb layer hidden."}</div></div>
        <div className="sidebar-foot"><div className="data-status"><Database size={14}/><span>DATASET STATUS</span><b>NOT CONNECTED</b></div><p>Historical reanalysis data has not yet been ingested.</p></div>
      </aside>
      <section className="map-column"><div className="map-toolbar"><div><span className="crumb">OVERVIEW</span><span className="crumb-sep">/</span><b>EUROPEAN ASH DISPERSION</b></div><div className="map-toolbar-right"><span className="map-date">● {date}</span><span className="map-tool">EUROPE VIEW</span></div></div><div className="map-wrap"><div ref={mapElement} className="map-canvas"/><div className="map-coordinates">NORTH ATLANTIC <span>·</span> EUROPE <span>·</span> 2010</div><div className="map-legend"><div className="legend-title">ASH CONCENTRATION <span>mg/m³</span></div><div className="legend-gradient"/><div className="legend-scale"><span>0.2</span><span>2</span><span>5</span><span>10+</span></div><div className="legend-caption">● Illustrative footprint · not measured data</div></div><div className="map-warning"><AlertTriangle size={14}/> DEMONSTRATION LAYER — NOT SCIENTIFIC OUTPUT</div></div><div className="map-footer"><span>● <b>ERUPTION SOURCE</b> Eyjafjallajökull</span><span>● <b>ASH FOOTPRINT</b> Schematic extent</span><span>● <b>MONITORED CITIES</b> 5 locations</span><small>MAP DATA © OPENSTREETMAP</small></div></section>
      <aside className="insights"><div className="insight-heading"><div><div className="section-kicker">LIVE MONITORING</div><h2>Atmospheric status</h2></div><Activity size={18}/></div><div className="metric-grid"><div className="metric-card"><span>ACTIVE GRID CELLS</span><strong>{(1240 + Math.round(progress * 31)).toLocaleString()}</strong><small>Illustrative computational cells</small><div className="metric-line"><i style={{width: (28 + progress * .55) + "%"}}/></div></div><div className="metric-card"><span>MAX ASH ALTITUDE</span><strong>8.2 <em>km</em></strong><small>Placeholder value</small><div className="metric-line alt"><i style={{width:"68%"}}/></div></div><div className="metric-card wide"><span>ESTIMATED DISPERSION RANGE</span><strong>1,840 <em>km</em></strong><small>Illustrative distance from source</small></div></div>
        <div className="city-section"><div className="block-heading"><span>CITY ALERT MONITOR</span><span className="muted-label">5 LOCATIONS</span></div><div className="city-list">{cities.map(c => <div className="city-row" key={c.name}><div className="city-initial">{c.name[0]}</div><div className="city-name"><b>{c.name}</b><small>{c.country}</small></div><div className={"alert-level " + c.level.toLowerCase().replace(" ","-")}>{c.level}</div><div className="city-value">{c.value}<small>mg/m³*</small></div></div>)}</div><p className="city-footnote">* Synthetic UI values, not observed concentrations. Alert bands are project-defined, not official aviation thresholds.</p></div>
        <div className="trend-section"><div className="block-heading"><span>CONCENTRATION TREND</span><span className="muted-label">DEMO SERIES</span></div><div className="trend-value">5.80 <span>mg/m³</span><small>Illustrative peak in selected interval</small></div><svg viewBox="0 0 100 40" preserveAspectRatio="none" className="sparkline"><polyline points="0,30 9,25 18,20 27,14 36,7 45,10 54,15 63,20 72,25 81,29 90,32 100,35" fill="none" stroke="#f59a62" strokeWidth="1.8" vectorEffect="non-scaling-stroke"/></svg><div className="trend-axis"><span>14 APR</span><span>18 APR</span><span>22 APR</span></div></div>
        <div className="export-row"><button onClick={exportSnapshot}><ArrowDownToLine size={15}/> EXPORT SNAPSHOT</button><button className="chart-button"><BarChart3 size={15}/> STATISTICS</button></div>
      </aside>
    </main>
    {settings && <div className="settings-popover"><button onClick={() => setSettings(false)}>×</button><b>Simulation settings</b><p>Scientific data ingestion and numerical solver are not connected in this prototype.</p><strong>ENGINE STATUS: UI DEMO</strong></div>}
    <footer className="global-footer"><span>YJH'S ICELAND VOLCANO SIMULATOR <i>v0.1.0</i></span><span>SCIENTIFIC PROTOTYPE · NOT FOR OPERATIONAL AVIATION DECISIONS</span></footer>
  </div>;
}
