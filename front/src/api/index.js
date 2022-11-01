import axios from "axios";

const api = axios.create({
	baseURL: "https://889czs16x3.execute-api.eu-west-1.amazonaws.com",
});

const getTableData = (token) =>
	api.get("/get_table_data", {
		headers: { Authorization: `Bearer ${token}` },
	});

const processData = (token, data) => {
	return api.post("/process_csv_data", data, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});
};

const updateTable = (token, data) => {
	return api.put("/update_table_data", data, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});
};

export { api as default, getTableData, processData, updateTable };
