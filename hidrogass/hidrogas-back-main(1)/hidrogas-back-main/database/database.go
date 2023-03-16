package database

import (
	"database/sql"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type DatabaseHandler struct {
	database *sql.DB
}

type ConectionConfig struct {
	IdleTime      time.Duration
	MaxConections int
}

func Open(path string, config ConectionConfig) (*DatabaseHandler, error) {
	db, err := sql.Open("sqlite3", path)
	if err != nil {
		return nil, err
	}

	db.SetConnMaxIdleTime(config.IdleTime)
	db.SetMaxOpenConns(config.MaxConections)

	handler := &DatabaseHandler{database: db}
	return handler, nil
}

func (h DatabaseHandler) Close() error {
	return h.database.Close()
}

func (h DatabaseHandler) IntegrityCheck() (string, error) {
	row := h.database.QueryRow("PRAGMA integrity_check")

	var result string
	err := row.Scan(&result)
	return result, err
}
