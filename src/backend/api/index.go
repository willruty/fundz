package handler

import (
	"fundz/internal/config"
	"fundz/internal/database"
	"fundz/internal/router"
	"net/http"
	"sync"
)

var (
	once sync.Once
	app  http.Handler
)

func Handler(w http.ResponseWriter, r *http.Request) {
	once.Do(func() {
		config.Load()
		database.DatabaseConnect()
		app = router.SetupMainRouter()
	})
	app.ServeHTTP(w, r)
}
