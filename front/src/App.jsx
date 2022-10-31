import { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import css from "./app.css";
import api, { processData } from "./api";
import Papa from "papaparse";
import { Spinner } from "@chakra-ui/react";

function App() {
	const location = useLocation();
	const history = useHistory();

	const [token, setToken] = useState(null);
	const [data, setData] = useState(null);
	const [header, setHeader] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (token) return;
		let tempToken;
		tempToken = location?.hash?.split("=")[1]?.split("&")[0];
		if (tempToken) localStorage.setItem("token", tempToken);
		else tempToken = localStorage.getItem("token");

		if (tempToken) {
			setToken(tempToken);
			history.push("/");
		}
	}, []);

	const handleUpload = (e) => {
		setLoading(true);
		const file = e.target.files[0];
		Papa.parse(file, {
			complete: async function (results) {
				const csvData = results.data.filter((row) => {
					return row.length > 1;
				});
				try {
					const { data } = await processData(token, csvData);
					setHeader(Object.keys(data[0]));
					setData(data.map((row) => Object.values(row)));
					setLoading(false);
				} catch (err) {
					console.log(err);
					alert(err);
					setLoading(false);
				}
			},
		});
	};

	return (
		<>
			<input type="file" onChange={handleUpload} />
			{loading ? (
				<Spinner></Spinner>
			) : (
				data && (
					<table>
						<thead>
							<tr>
								{header?.map((h, i) => (
									<th key={i}>{h}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{data?.map((row, i) => (
								<tr key={i}>
									{row?.map((cell, i) => (
										<td key={i}>{cell}</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				)
			)}
		</>
	);
}

export default App;
