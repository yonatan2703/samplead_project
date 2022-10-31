import axios from "axios";

const api = axios.create({
	baseURL: "https://889czs16x3.execute-api.eu-west-1.amazonaws.com",
});

const getPreviousSession = (token) =>
	api.get("/session", { headers: { Authorization: `Bearer ${token}` } });

const getAllSessions = (token) =>
	api.get("/sessions", { headers: { Authorization: `Bearer ${token}` } });

const processData = (token, data) => {
	return api.post("/process_csv_data", data, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});
};

const updateTable = (token, data) => {
	return api.post("/updateTable", formData, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "multipart/form-data",
		},
	});
};

export {
	api as default,
	getPreviousSession,
	getAllSessions,
	processData,
	updateTable,
};
