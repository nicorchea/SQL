package web

import (
	"database/sql"
	"log"
	"net/http"

	"hidrogas/database"
	"hidrogas/models"

	"github.com/gin-gonic/gin"
)

func listHandler(db *database.DatabaseHandler) gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Printf("warning do not use %s in production\n", c.Request.URL)
		data, err := db.GetAllItems()

		if err != nil {
			log.Printf("handler error %s: %s\n", c.Request.URL, err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.JSON(http.StatusOK, data)
	}
}

func itemHandler(db *database.DatabaseHandler) gin.HandlerFunc {
	return func(c *gin.Context) {
		code := c.Query("code")

		if len(code) <= 0 {
			log.Println("empty query")
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}

		data, err := db.GetItem(code)

		if err == sql.ErrNoRows {
			log.Printf("no rows found for %s\n", code)
			c.AbortWithStatus(http.StatusNotFound)
			return
		} else if err != nil {
			log.Printf("handler error %s: %s\n", c.Request.URL, err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.JSON(http.StatusOK, data)
	}
}

func checkCodeHandler(db *database.DatabaseHandler) gin.HandlerFunc {
	return func(c *gin.Context) {
		found, err := db.FindCode(c.Query("code"))

		if err != nil {
			log.Printf("handler error %s: %s\n", c.Request.URL, err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		res := struct {
			Exists bool `json:"exists"`
		}{Exists: found}

		c.JSON(http.StatusOK, res)
	}
}

func infoHandler(db *database.DatabaseHandler) gin.HandlerFunc {
	return func(c *gin.Context) {
		data := db.GetDatabaseInfo()
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.JSON(http.StatusOK, data)
	}
}

func registerHandler(db *database.DatabaseHandler) gin.HandlerFunc {
	return func(c *gin.Context) {
		var newItem models.Item

		if err := c.BindJSON(&newItem); err != nil {
			log.Println("error couldn't bind json when registering handler")
			return
		}

		if c.Query("password") != "1234" { //TODO: jejejejeje!
			c.AbortWithStatus(http.StatusUnauthorized)
			log.Printf("update handler bad password updating: %s\n", newItem.Code)
			return
		}

		found, err := db.FindCode(newItem.Code) //TODO: check this on query

		if err != nil {
			log.Printf("error coudln't check code %s on database", newItem.Code)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		if found {
			log.Printf("rejected, item code %s is already on database", newItem.Code)
			c.AbortWithStatus(http.StatusConflict)
			return
		}

		if err := db.AddItem(newItem); err != nil {
			log.Printf("error couldn't add item to database: %s\n", err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		c.AbortWithStatus(http.StatusCreated)
		log.Printf("registered item %s on database!\n", newItem.Name)
	}
}

func updateHandler(db *database.DatabaseHandler) gin.HandlerFunc {
	return func(c *gin.Context) {
		var newState models.State

		if err := c.BindJSON(&newState); err != nil {
			log.Println("error couldn't bind json when registering handler")
			return
		}

		var codeQuery = c.Query("code")

		if c.Query("code") == "" {
			c.AbortWithStatus(http.StatusBadRequest)
			log.Println("update handler no query code found")
			return
		}

		if c.Query("password") != "1234" { //TODO: jejejejeje!
			c.AbortWithStatus(http.StatusUnauthorized)
			log.Printf("update handler bad password updating: %s\n", codeQuery)
			return
		}

		if err := db.UpdateState(codeQuery, newState); err != nil {
			log.Printf("error couldn't update item: %s\n", err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		c.AbortWithStatus(http.StatusOK)
		log.Printf("updated item %s on database!\n", codeQuery)
	}
}

func deleteHandler(db *database.DatabaseHandler) gin.HandlerFunc {
	return func(c *gin.Context) {
		code := c.Query("code")

		if code == "" {
			c.AbortWithStatus(http.StatusBadRequest)
			log.Println("delete handler no query code found")
			return
		}

		if c.Query("password") != "1234" { //TODO: jejejejeje!
			c.AbortWithStatus(http.StatusUnauthorized)
			log.Printf("delete handler bad password updating: %s\n", code)
			return
		}

		err, rows := db.DeleteItem(code)

		if err != sql.ErrNoRows {
			c.AbortWithStatus(http.StatusInternalServerError)
			log.Printf("error deleting item: %s\n", code)
			return
		}

		c.AbortWithStatus(http.StatusOK)
		log.Printf("requested deletion for item %s  (affected rows: %d)\n", code, rows)
	}
}
