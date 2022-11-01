import react, { useState, useEffect } from "react";

const EditableCell = ({ initialValue, row, column, updateMyData }) => {
	const [value, setValue] = useState(initialValue);

	const onChange = (e) => {
		setValue(e.target.value);
	};

	const onBlur = () => {
		updateMyData(row, column, value);
	};

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	return (
		<input
			type="text"
			style={{ width: "40rem" }}
			value={value}
			onChange={onChange}
			onBlur={onBlur}
		/>
	);
};

export default EditableCell;
