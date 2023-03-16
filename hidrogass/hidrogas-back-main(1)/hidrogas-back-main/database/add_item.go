package database

import (
	"hidrogas/models"
	"time"
)

func (h DatabaseHandler) AddItem(item models.Item) error {
	currentDate := time.Now().Format("2006-01-02")

	query := "INSERT INTO item_data (name, code, image, date, taken_by, state, site) VALUES (?, ?, ?, ?, ?, ?, ?)"
	_, err := h.database.Exec(query, item.Name, item.Code, item.Image, currentDate, item.By, item.State, item.Site)
	return err
}
