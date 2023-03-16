package database

import "database/sql"

func (h DatabaseHandler) GetDatabaseInfo() sql.DBStats {
	return h.database.Stats()
}
