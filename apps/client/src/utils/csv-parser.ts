/** A robust CSV parser that handles quoted fields and variable columns
 * @param csvData - the csv data in string form
 * @returns object[] - an array of the data in object form.
 */
export function parseCSV(csvData: string): object[] {
	const rows: string[] = csvData.trim().split("\n");

	if (rows.length === 0) return [];

	// Parse header row
	const headers = parseCSVRow(rows[0]);

	// Parse data rows
	const result: object[] = [];

	for (let i = 1; i < rows.length; i++) {
		const row = rows[i].trim();
		if (row === "") continue; // Skip empty rows

		const values = parseCSVRow(row);
		const obj: Record<string, string | null> = {};

		// Map values to headers
		for (let j = 0; j < headers.length; j++) {
			const value = values[j] || "";
			// Convert "null" string to actual null
			obj[headers[j]] = value === "null" ? null : value;
		}

		result.push(obj);
	}

	return result;
}

/** Helper function to parse a CSV row handling quoted fields
 * @param row - a single CSV row as a string
 * @returns string[] - array of parsed values
 */
function parseCSVRow(row: string): string[] {
	const result: string[] = [];
	let current = "";
	let insideQuotes = false;

	for (let i = 0; i < row.length; i++) {
		const char = row[i];
		const nextChar = row[i + 1];

		if (char === '"') {
			// Handle escaped quotes (two consecutive quotes)
			if (nextChar === '"') {
				current += '"';
				i++; // Skip next quote
			} else {
				// Toggle quote state
				insideQuotes = !insideQuotes;
			}
		} else if (char === "," && !insideQuotes) {
			// Field separator (only if not inside quotes)
			result.push(current.trim());
			current = "";
		} else {
			current += char;
		}
	}

	// Add the last field
	result.push(current.trim());

	return result;
}
