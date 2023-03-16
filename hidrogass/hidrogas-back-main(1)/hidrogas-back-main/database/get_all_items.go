package database

import (
	"hidrogas/models"
)

func (h DatabaseHandler) GetAllItems() ([]models.Item, error) {
	rows, err := h.database.Query("SELECT * FROM item_data")

	if err != nil {
		return nil, err
	}

	defer rows.Close()
	var itemArray []models.Item

	for rows.Next() {
		var item models.Item
		rows.Scan(&item.Name, &item.Code, &item.Image, &item.Date, &item.By, &item.State, &item.Site)
		itemArray = append(itemArray, item)
	}

	return itemArray, nil
}
