import { StopDataProvider, Stop } from "../data/StopDataProvider";

import 'leaflet/dist/leaflet.css'
import 'react-leaflet-markercluster/styles'

import { useEffect, useState } from 'react';
import LineIcon from '../components/LineIcon';
import { Link } from 'react-router';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { Icon, LatLngTuple } from "leaflet";
import { LocateControl } from "../controls/LocateControl";

const icon = new Icon({
	iconUrl: '/map-pin-icon.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

const sdp = new StopDataProvider();

export function StopMap() {
	const [stops, setStops] = useState<Stop[]>([]);
	const position: LatLngTuple = [42.229188855975046, -8.72246955783102]

	useEffect(() => {
		sdp.getStops().then((stops) => { setStops(stops); });
	}, []);

	return (
		<MapContainer center={position} zoom={14} scrollWheelZoom={true} style={{ height: '100%' }}>
			<TileLayer
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
				url="https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png"
			/>
			<LocateControl />
			<MarkerClusterGroup>
				{stops.map((stop) => (
					<Marker key={stop.stopId} position={[stop.latitude, stop.longitude] as LatLngTuple} icon={icon}>
						<Popup>
							<Link to={`/estimates/${stop.stopId}`}>{stop.name}</Link>
							<br />
							{stop.lines.map((line) => (
								<LineIcon key={line} line={line} />
							))}
						</Popup>
					</Marker>
				))}
			</MarkerClusterGroup>

		</MapContainer>
	);
}
