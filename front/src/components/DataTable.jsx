import React from "react";
import {
	Spinner,
	TableContainer,
	Table,
	Thead,
	Tbody,
	Tr,
	Td,
} from "@chakra-ui/react";

import EditableCell from "./EditableCell";

export default function DataTable({ header, data, updateMyData }) {
	return (
		<TableContainer>
			<Table size="sm">
				<Thead>
					<Tr>
						{header.map((h, i) => (
							<th key={i}>{h}</th>
						))}
					</Tr>
				</Thead>
				<Tbody>
					{Object.entries(data).map(
						([index, { Name, Description, nlp_output }]) => (
							<Tr key={index}>
								<Td>{Name}</Td>
								<Td>{Description}</Td>
								<Td style={{ maxWidth: "40rem" }}>
									{updateMyData ? (
										<EditableCell
											initialValue={nlp_output}
											row={index}
											column={"nlp_output"}
											updateMyData={updateMyData}
										/>
									) : (
										nlp_output
									)}
								</Td>
							</Tr>
						)
					)}
				</Tbody>
			</Table>
		</TableContainer>
	);
}
