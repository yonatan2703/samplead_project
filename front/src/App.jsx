import { useEffect, useState, useRef, useMemo } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Papa from "papaparse";
import { Spinner, Heading, Box, Button } from "@chakra-ui/react";

import { processData, getTableData, updateTable } from "./api";
import DataTable from "./components/DataTable";
import AdminTable from "./components/AdminTable";

const LOGIN_URL =
	"https://users-domin.auth.eu-west-1.amazoncognito.com/login?client_id=msuie6bb4ttkrm3k1bt1si5mr&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://splendid-froyo-eb4a6f.netlify.app";

function App() {
	const location = useLocation();
	const history = useHistory();

	const [token, setToken] = useState(null);
	const [data, setData] = useState(null);
	const [adminData, setAdminData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [uploadLoading, setUploadLoading] = useState(false);

	const inputRef = useRef(null);
	const header = useMemo(() => {
		return ["Name", "Description", "nlp_output"];
	}, []);

	const navigateUrl = (url) => {
		let element = document.createElement("a");

		if (url.startsWith("http://") || url.startsWith("https://")) {
			element.href = url;
		} else {
			element.href = "http://" + url;
		}

		element.click();
	};

	useEffect(() => {
		if (token) return;
		let tempToken;
		tempToken = location?.hash?.split("=")[1]?.split("&")[0];
		if (tempToken) localStorage.setItem("token", tempToken);
		else tempToken = localStorage.getItem("token");

		if (tempToken) {
			setToken(tempToken);
			history.push("/");
		} else {
			navigateUrl(LOGIN_URL);
		}
	}, []);

	useEffect(() => {
		if (!token) return;
		setLoading(true);
		getTableData(token)
			.then((res) => {
				const { prevSession, adminData } = res.data;
				const data = prevSession?.[0]?.data;
				if (data) {
					setData(data);
				}
				if (adminData) setAdminData(adminData);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				alert(err);
				setLoading(false);
			});
	}, [token]);

	const handleUpload = (e) => {
		setUploadLoading(true);
		const file = e.target.files[0];
		Papa.parse(file, {
			complete: async function (results) {
				const csvData = results.data.filter((row) => {
					return row.length > 1;
				});
				try {
					const [[col1, col2], ...dataWoHeader] = csvData;
					if (col1 !== "Name" || col2 !== "Description") {
						throw "Wrong column names, first column should be Name and second column should be Description";
					}
					const { data } = await processData(token, dataWoHeader);
					setData(data);

					setUploadLoading(false);
				} catch (err) {
					console.log(err);
					alert(err);
					setUploadLoading(false);
				}
			},
		});
		// reset input value
		inputRef.current.value = "";
	};

	const updateMyData = (rowIndex, columnId, value) => {
		setData((prev) => {
			prev[rowIndex][columnId] = value;
			return { ...prev };
		});
		const data = {
			index: rowIndex,
			[columnId]: value,
		};
		updateTable(token, data)
			.then((res) => {
				console.log(res.data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				alert(err);
				setLoading(false);
			});
	};

	return (
		<Box
			display="flex"
			flexDir="column"
			justifyContent="center"
			alignItems="center"
		>
			<Heading m="5"> Upload your CSV file</Heading>
			<Box>
				<input type="file" onChange={handleUpload} ref={inputRef} />
				<Button>
					<a
						href={LOGIN_URL}
						onClick={() => {
							localStorage.removeItem("token");
						}}
					>
						Logout
					</a>
				</Button>
			</Box>
			{loading ? (
				<Spinner />
			) : (
				<Box
					display="flex"
					flexDir="column"
					justifyContent="center"
					alignItems="center"
				>
					{uploadLoading ? (
						<Spinner />
					) : (
						data && (
							<DataTable
								header={header}
								data={data}
								updateMyData={updateMyData}
							/>
						)
					)}
					{adminData && (
						<AdminTable adminData={adminData} header={header} />
					)}
				</Box>
			)}
		</Box>
	);
}

export default App;
