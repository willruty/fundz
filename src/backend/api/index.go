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
)

func init() {
	once.Do(func() {
		config.Load()
		database.DatabaseConnect()
	})
}

func Handler(w http.ResponseWriter, r *http.Request) {
	router.SetupMainRouter().ServeHTTP(w, r)
}
