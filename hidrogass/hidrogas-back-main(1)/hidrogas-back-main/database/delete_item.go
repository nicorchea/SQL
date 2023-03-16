package database

func (h DatabaseHandler) DeleteItem(code string) (error, int) {
	row := h.database.QueryRow("DELETE FROM item_data WHERE code=?", code)

	var data int
	err := row.Scan(&data)

	return err, data
}
