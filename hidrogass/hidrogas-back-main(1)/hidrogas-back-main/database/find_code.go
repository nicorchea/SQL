package database

func (h DatabaseHandler) FindCode(code string) (bool, error) {
	row := h.database.QueryRow("SELECT EXISTS(SELECT 1 FROM item_data WHERE code=? LIMIT 1)", code)

	var found int
	err := row.Scan(&found)

	return (found == 1), err
}
