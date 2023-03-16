package database

import (
	"hidrogas/models"
)

func (h DatabaseHandler) GetItem(code string) (models.Item, error) {
	row := h.database.QueryRow("SELECT * FROM item_data WHERE code=? LIMIT 1", code)

	var item models.Item
	err := row.Scan(&item.Name, &item.Code, &item.Image, &item.Date, &item.By, &item.State, &item.Site)

	return item, err
}
