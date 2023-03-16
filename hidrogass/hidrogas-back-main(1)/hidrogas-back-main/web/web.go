package web

import (
	"hidrogas/database"
	"net/http"

	"github.com/gin-gonic/gin"
)

type WebHandler struct {
	engine *gin.Engine
}

func Create() (*WebHandler, error) {
	return &WebHandler{engine: gin.New()}, nil
}

func (w WebHandler) RegisterRoutes(db *database.DatabaseHandler) {
	w.engine.GET("/list", listHandler(db))
	w.engine.GET("/item", itemHandler(db))
	w.engine.GET("/check", checkCodeHandler(db))
	w.engine.GET("/info", infoHandler(db))

	w.engine.POST("/register", registerHandler(db))
	w.engine.POST("/update", updateHandler(db))
	w.engine.GET("/delete", deleteHandler(db))
}

func (w WebHandler) Serve(addr string) error {
	return http.ListenAndServe(addr, w.engine)
}
