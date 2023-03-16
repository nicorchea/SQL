package main

import (
	"log"
	"time"

	"hidrogas/database"
	"hidrogas/web"

	"github.com/gin-gonic/gin"
)

func setCfg() {
	//TODO: properly set this
	gin.SetMode(gin.DebugMode)
}

func main() {
	setCfg()

	//-------------------------------------------------------------------------------------------------------------------
	db, err := database.Open("local_database.db", database.ConectionConfig{IdleTime: time.Minute * 1, MaxConections: 16})

	if err != nil {
		log.Fatalf("error trying to open database: %s\n", err)
	}

	log.Println("database conected OK...")
	defer db.Close()

	res, err := db.IntegrityCheck()
	if res != "ok" || err != nil {
		log.Printf("\nerror doing integrity check: %s\nerr: %s\n\n", res, err)
	}

	log.Println("database integrity check OK...")
	//-------------------------------------------------------------------------------------------------------------------

	sv, err := web.Create()

	if err != nil {
		log.Fatalf("error trying to create http server: %s\n", err)
	}

	sv.RegisterRoutes(db)

	log.Println("server listening...")

	err = sv.Serve(":8888")

	if err != nil {
		log.Fatalf("error couldn't listen: %s\n", err)
	}
}
