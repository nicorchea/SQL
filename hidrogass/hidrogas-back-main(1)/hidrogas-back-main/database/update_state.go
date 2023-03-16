package database

import (
	"hidrogas/models"
	"time"
)

func (h DatabaseHandler) UpdateState(code string, state models.State) error {
	currentDate := time.Now().Format("2006-01-02")

	query := "UPDATE item_data SET date = ?, taken_by = ?, state = ?, site = ? WHERE code = ?"
	_, err := h.database.Exec(query, currentDate, state.By, state.State, state.Site, code)
	return err
}
